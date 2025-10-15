# Category Management Feature

## ✅ Complete CRUD Operations for Categories

The admin panel now has full category management capabilities!

---

## 🎯 Features Added

### 1. **Categories Tab**
New tab in admin panel navigation between "Tables" and "Menu Items"

### 2. **View All Categories**
- Display all categories in a table
- Shows: Slug, Display Order, Status (Active/Inactive)
- Sorted by display order

### 3. **Add New Category**
- Click "+ Add Category" button
- Enter category slug (e.g., "appetizers", "desserts")
- Set display order (0, 1, 2, etc.)
- Toggle active/inactive status
- Slug is automatically formatted (lowercase, underscores)

### 4. **Edit Category**
- Click "Edit" button on any category
- Modify slug, display order, or status
- Save changes

### 5. **Delete Category**
- Click "Delete" button on any category
- Confirmation dialog warns about menu items
- Menu items using deleted category will have `category_id = null`

---

## 📊 How It Works

### Database Structure
```sql
categories:
- id (UUID)
- slug (VARCHAR) - e.g., "appetizers", "mains", "desserts"
- display_order (INTEGER) - controls sort order
- active (BOOLEAN) - show/hide category
```

### Category Slugs
Categories use **slugs** instead of multi-language names:
- Database: `slug = "appetizers"`
- Translations in `lang/*.json`:
  - EN: "Appetizers"
  - FR: "Entrées"
  - AR: "المقبلات"

---

## 🎨 Admin Interface

### Categories Table
```
┌─────────────┬───────────────┬──────────┬─────────────┐
│ Slug        │ Display Order │ Status   │ Actions     │
├─────────────┼───────────────┼──────────┼─────────────┤
│ appetizers  │ 1             │ Active   │ Edit Delete │
│ mains       │ 2             │ Active   │ Edit Delete │
│ desserts    │ 3             │ Active   │ Edit Delete │
│ drinks      │ 4             │ Active   │ Edit Delete │
└─────────────┴───────────────┴──────────┴─────────────┘
```

### Add/Edit Modal
```
┌─────────────────────────────────┐
│ Add Category                 × │
├─────────────────────────────────┤
│ Slug (lowercase, no spaces)     │
│ [appetizers____________]        │
│                                 │
│ Display Order                   │
│ [1___]                          │
│                                 │
│ ☑ Active                        │
│                                 │
│ [Cancel]  [Save]                │
└─────────────────────────────────┘
```

---

## 🔄 Workflow

### Adding a New Category
1. Go to Admin Panel → Categories tab
2. Click "+ Add Category"
3. Enter slug (e.g., "salads")
4. Set display order (e.g., 2 to show after appetizers)
5. Ensure "Active" is checked
6. Click "Save"
7. Category appears in the list

### Editing a Category
1. Click "Edit" button on category
2. Modify slug, order, or status
3. Click "Save"
4. Changes reflected immediately

### Deleting a Category
1. Click "Delete" button
2. Confirm deletion
3. Category removed from database
4. Menu items using this category will have no category

---

## 💡 Use Cases

### Example 1: Add "Salads" Category
```javascript
Slug: salads
Display Order: 2 (between appetizers and mains)
Active: ✓
```

Then add translations in `lang/en.json`:
```json
{
  "customer": {
    "categories": {
      "salads": "Salads"
    }
  }
}
```

### Example 2: Seasonal Categories
```javascript
// Add "specials" category
Slug: specials
Display Order: 0 (shows first)
Active: ✓

// Later, deactivate when season ends
Active: ✗ (hides from customer view)
```

### Example 3: Reorder Categories
```javascript
// Change display order to reorder menu sections
appetizers: 1
salads: 2
mains: 3
desserts: 4
drinks: 5
```

---

## 🔗 Integration with Menu Items

### When Creating Menu Items
The category dropdown in "Add Menu Item" will show all active categories:
```html
<select id="itemCategory">
  <option value="appetizers">Appetizers</option>
  <option value="mains">Main Courses</option>
  <option value="desserts">Desserts</option>
  <option value="drinks">Drinks</option>
  <option value="salads">Salads</option> <!-- New category -->
</select>
```

### Menu Item Storage
```javascript
{
  name: "Greek Salad",
  price: 75.00,
  category_id: "uuid-of-salads-category"
}
```

---

## ✨ Benefits

### 1. **Flexibility**
- Add new categories anytime
- No code changes needed
- No database migration required

### 2. **Control**
- Reorder categories by changing display_order
- Hide categories temporarily (set inactive)
- Delete unused categories

### 3. **Multilingual**
- Category slugs work across all languages
- Translations in language files
- Easy to add new languages

### 4. **Clean Data**
- Categories stored once
- Menu items reference by ID
- No duplicate category names

---

## 🚀 What's Next

### Recommended Workflow:
1. **Run `setup_v3.sql`** to create categories table
2. **Default categories** are created automatically:
   - appetizers
   - mains
   - desserts
   - drinks
3. **Add custom categories** as needed
4. **Update language files** with translations
5. **Assign categories** to menu items

---

## 📝 Notes

- **Slug format**: lowercase, use underscores for spaces
- **Display order**: Lower numbers appear first (0, 1, 2, 3...)
- **Active status**: Only active categories show in customer interface
- **Deletion**: Be careful - menu items will lose their category reference

---

**Category management is now fully functional! 🎉**
