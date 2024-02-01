<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Http\Resources\CategoryResource;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Staudenmeir\LaravelAdjacencyList\Eloquent\HasRecursiveRelationships;

class Category extends Model
{
    use HasFactory, HasRecursiveRelationships;


    protected $fillable = ['name', 'parent_id', 'level', 'discount_id'];

    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    public function items()
    {
        return $this->hasMany(Item::class, 'cat_id');
    }

    public function getList()
    {
        // Check if it's a top-level category
        if ($this->parent_id === null) {
            // Retrieve only the leaf nodes (lowest level children)
            $descendantsAndSelf = $this->getDescendantsAndSelf();

            $filteredDescendants = $descendantsAndSelf->filter(function ($category) {
                return $category->children->isEmpty();
            });

            return CategoryResource::collection($filteredDescendants);
        } else {
            // Retrieve top-level categories
            return CategoryResource::collection($this->get());
        }
    }

    public function discounts()
    {
        return $this->belongsTo(Discount::class);
    }
}
