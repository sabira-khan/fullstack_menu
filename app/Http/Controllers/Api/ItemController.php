<?php

namespace App\Http\Controllers\Api;

use App\Models\Item;
use App\Models\Category;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\ItemResource;
use App\Http\Requests\StoreItemRequest;

class ItemController extends Controller
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
        $items = Item::when(request('search_id'), function ($query) {
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
        return ItemResource::collection($items);
    }

    public function show(Item $item)
    {
        $this->authorize('item-edit');
        return new ItemResource($item);
    }

    public function store(StoreItemRequest $request)
    {
        $this->authorize('item-create');
        // Validate and create item
        $validatedData = $request->validated();

        // $category = Category::find($validatedData['cat_id']);

        // // Check if the category has children of the Category model
        // if ($category && $category->children()->exists()) {
        //     return response()->json(['error' => 'Cannot create an item under a category with Category children.'], 422);
        // }

        $item = Item::create($validatedData);

        return new ItemResource($item);
    }

    public function update(Item $item, StoreItemRequest $request)
    {
        $this->authorize('item-edit');

        $validatedData = $request->validated();

        $category = Category::find($validatedData['cat_id']);

        // Check if the category has children of the Category model
        if ($category && $category->children()->exists()) {
            return response()->json(['error' => 'Cannot update the item under a category with Category children.'], 422);
        }

        $item->update($validatedData);

        return new ItemResource($item);
    }

    public function destroy(Item $item)
    {
        $item->delete();

        return response()->json(['message' => 'Item deleted successfully']);
    }

    public function getList()
    {
        return ItemResource::collection(Item::all());
    }
}
