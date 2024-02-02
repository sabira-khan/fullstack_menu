# FullStack Restaurant Menu Project

![Menu](https://res.cloudinary.com/saboora/image/upload/v1706883803/Screenshot_1189_htpgmo.png)

Let’s build a restaurant menu that contains categories, subcategories, and items with supporting discounts. 🍽️

## Features:

1. **Menu:**

    - Can admin create categories, subcategories, and items for his menu?
        - Yes.
    - What is the maximum level of subcategories?
        - Currently capped at Four.
    - Can category or subcategory have mixed children?
        - No, their children type at any level are only subcategories or items. Validation applied plus UX also doesn't allow.

2. **Discounts:**
    - Can restaurant admin create discounts for his menu?
        - Yes.
    - What are the discount types?
        - All Menu Discount, Category/Subcategory Discount, Item Discount.
    - Do items and subcategories inherit the closest discount if they don’t have one?
        - Yes. All cases properly handled in controller.
    - Is the menu be returned from the backend with computed discounts?
        - Yes!

## Technical:

-   Frontend is a Single Page Application using Vue 3 - Vite.
-   Backend is PHP Laravel 10. 🐘
-   Meaningful Git Commits
-   Clean code (almost lol!)
-   [Bundle Analyzer Screenshot Link](https://res.cloudinary.com/saboora/image/upload/v1706883627/Screenshot_1188_k00prb.png) Will improve
-   Authentication (Each user has own menu)
-   Dummy SQL added to replicate photo menu
