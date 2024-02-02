<?php

namespace App\Http\Controllers\Api;


use App\Models\Item;
use App\Models\Category;
use App\Models\Discount;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\DiscountResource;
use App\Http\Requests\StoreDiscountRequest;

class DiscountController extends Controller
{
    public function index()
    {
        $orderColumn = request('order_column', 'created_at');
        if (!in_array($orderColumn, ['id', 'name', 'created_at'])) {
            $orderColumn = 'created_at';
        }
        $orderDirection = request('order_direction', 'desc');
        if (!in_array($orderDirection, ['asc', 'desc'])) {
            $orderDirection = 'desc';
        }
        $discounts = Discount::when(request('search_id'), function ($query) {
            $query->where('id', request('search_id'));
        })
            ->when(request('search_title'), function ($query) {
                $query->where('name', 'like', '%' . request('search_title') . '%');
            })
            ->when(request('search_global'), function ($query) {
                $query->where(function ($q) {
                    $q->where('id', request('search_global'))
                        ->orWhere('name', 'like', '%' . request('search_global') . '%');
                });
            })
            ->orderBy($orderColumn, $orderDirection)
            ->paginate(50);
        return DiscountResource::collection($discounts);
    }

    public function store(StoreDiscountRequest $request)
    {
        $this->authorize('discount-create');
        $validatedData = $request->validated();

        $discount = Discount::create($validatedData);

        // Apply the discount logic based on the discount type
        switch ($request->input('type')) {
            case 'Menu':
                // Apply the discount to all items
                $discountPercentage = $discount->discount_value / 100;

                // Get all items
                $allItems = Item::all();

                // Update each item individually
                foreach ($allItems as $item) {
                    $item->discount_id = $discount->id;
                    $item->amount -= $item->amount * $discountPercentage;
                    $item->save();
                }
                break;

            case 'Category':
                // Apply the discount to items under the specified category or subcategory - inheritance logic for null items under leaves

                if ($categoryId = $request->input('category_id')) {
                    // Find the specified category
                    $category = Category::find($categoryId);

                    // Check if the category was found
                    if ($category) {
                        // Get all leaf categories using getList method
                        $leafCategories = $category->getRecursiveSubcategories();

                        // Collect all items under leaf categories
                        $itemsToUpdate = collect();
                        foreach ($leafCategories as $leafCategory) {
                            $itemsToUpdate = $itemsToUpdate->merge($leafCategory->items);
                        }

                        // Apply the discount to each item individually
                        foreach ($itemsToUpdate as $item) {
                            // Only update items with a null discount_id
                            if (is_null($item->discount_id)) {
                                $item->discount_id = $discount->id;
                                $item->amount -= $item->amount * ($discount->discount_value / 100);
                                $item->save();
                            }
                        }
                    }
                }
                break;

            case 'Item':
                // Apply the discount to the specified item
                if ($item = Item::find($request->input('item_id'))) {
                    $item->update([
                        'discount_id' => $discount->id,
                        'amount' => $item->amount - $item->amount * $discount->discount_value / 100,
                    ]);
                }
                break;

            default:
                // Handle other cases or throw an exception if needed
                break;
        }

        return new DiscountResource($discount);
    }

    public function show(Discount $discount)
    {
        $this->authorize('discount-edit');
        return new DiscountResource($discount);
    }

    public function update(Discount $discount, StoreDiscountRequest $request)
    {

        $this->authorize('discount-edit');

        // // Validate and update discount
        // $validatedData = $request->validated();

        // $parentDiscount = Discount::find($validatedData['parent_id']);

        // // If the parent is being updated, check if it has item children
        // if ($parentDiscount && $parentDiscount->items()->exists()) {
        //     return response()->json(['error' => 'Cannot update the parent discount with Item children.'], 422);
        // }

        // $discount->update($validatedData);


        return new DiscountResource($discount);
    }

    public function destroy(Discount $discount)
    {
        $this->authorize('discount-delete');
        $discount->delete();

        return response()->noContent();
    }
}
