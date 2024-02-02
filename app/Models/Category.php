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
        // Retrieve only leaf categories to add items or only leaf 
        $leafCategories = $this->isLeaf()->get();
        return CategoryResource::collection($leafCategories);
    }

    public function getRecursiveSubcategories()
    {
        // Retrieve only leaf categories with items
        $leafCategories = $this->descendants()->get();
        return CategoryResource::collection($leafCategories);
    }

    public function discounts()
    {
        return $this->belongsTo(Discount::class);
    }
}
