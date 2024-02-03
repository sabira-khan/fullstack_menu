<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
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
        $categories = Category::when(request('search_id'), function ($query) {
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
            ->where('level', '=', 0)
            ->orderBy($orderColumn, $orderDirection)
            ->paginate(50);
        return CategoryResource::collection($categories);
    }

    public function store(StoreCategoryRequest $request)
    {
        $this->authorize('category-create');

        // Validate and create category
        $validatedData = $request->validated();

        $parentCategory = Category::find($validatedData['parent_id']);

        if ($parentCategory && $parentCategory->items()->exists()) {
            return response()->json(['error' => 'Cannot create a category under a parent with Item children.'], 422);
        }
        $category = Category::create($validatedData);

        return new CategoryResource($category);
    }

    public function show(Category $category)
    {
        $this->authorize('category-edit');
        return new CategoryResource($category);
    }

    public function update(Category $category, StoreCategoryRequest $request)
    {

        $this->authorize('category-edit');

        // Validate and update category
        $validatedData = $request->validated();

        $parentCategory = Category::find($validatedData['parent_id']);

        // If the parent is being updated, check if it has item children
        if ($parentCategory && $parentCategory->items()->exists()) {
            return response()->json(['error' => 'Cannot update the parent category with Item children.'], 422);
        }

        $category->update($validatedData);


        return new CategoryResource($category);
    }

    public function destroy(Category $category)
    {
        $this->authorize('category-delete');

        // Check if it's a leaf category (no children) and has no items
        if ($category->isLeaf() && !$category->items()->exists()) {
            $category->delete();

            return response()->noContent();
        }

        return response()->json(['error' => 'Deletion unsuccessful! Entity must be a leaf category with no items.'], 422);
    }


    public function getList()
    {
        return CategoryResource::collection(Category::all());
    }

    public function getList2()
    {
        // Retrieve categories without items
        $categoriesWithoutItems = Category::doesntHave('items')->get();

        return CategoryResource::collection($categoriesWithoutItems);
    }



    public function getSubcategories()
    {
        $orderColumn = request('order_column', 'created_at');
        if (!in_array($orderColumn, ['id', 'name', 'created_at'])) {
            $orderColumn = 'created_at';
        }

        $orderDirection = request('order_direction', 'desc');
        if (!in_array($orderDirection, ['asc', 'desc'])) {
            $orderDirection = 'desc';
        }

        $categories = Category::when(request('search_id'), function ($query) {
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
            ->where('level', '>', 0) // Add this condition for level > 0
            ->orderBy($orderColumn, $orderDirection)
            ->paginate(50);

        return CategoryResource::collection($categories);
    }

    public function getLastChildren()
    {
        $category = new Category();
        // Call the getList method on the instance
        $categories = $category->getList();

        // dd($categories);

        return CategoryResource::collection($categories);
    }

    public function getMenu()
    {
        $categories = Category::with('items')->tree()->get()->toTree();

        return CategoryResource::collection($categories);
    }
}
