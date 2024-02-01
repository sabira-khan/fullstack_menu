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
        $items = Item::all();

        return ItemResource::collection($items);
    }

    public function show(Item $item)
    {
        return new ItemResource($item);
    }

    public function store(StoreItemRequest $request)
    {
        $this->authorize('item-create');
        // Validate and create item
        $validatedData = $request->validated();

        $category = Category::find($validatedData['cat_id']);

        // Check if the category has children of the Category model
        if ($category && $category->children()->exists()) {
            return response()->json(['error' => 'Cannot create an item under a category with Category children.'], 422);
        }

        $item = Item::create($validatedData);

        return new ItemResource($item);
    }

    public function update(Item $item, StoreItemRequest $request)
    {
        // Validate and update item
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
