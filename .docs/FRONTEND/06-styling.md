# Frontend - Estilos y Temas

## 1. Styling Stack

| Tool            | Purpose                  | Config File             |
|-----------------|-------------------------|-------------------------|
| Tailwind CSS 3  | Utility-first CSS       | `tailwind.config.js`    |
| PostCSS         | CSS processing          | `postcss.config.js`     |
| Autoprefixer    | Vendor prefixing        | (via PostCSS)           |

## 2. Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Custom theme colors
      },
      fontFamily: {
        // Custom fonts
      },
    },
  },
  plugins: [],
}
```

## 3. CSS Structure

```
index.css
├── @tailwind base
├── @tailwind components
├── @tailwind utilities
├── Base styles (html, body)
└── Custom utilities (.app-loading, .spinner-lg)
```

## 4. Theme System

### ThemeContext (`context/ThemeContext.tsx`)
```typescript
interface ThemeContextState {
  theme: 'light' | 'dark'
  toggleTheme() → switches between light/dark
}
```

### Theme Classes
```html
<div class="bg-white dark:bg-gray-900">
  <p class="text-gray-900 dark:text-gray-100">
  <button class="bg-blue-600 hover:bg-blue-700 text-white">
```

## 5. Responsive Design

### Breakpoints
| Breakpoint | Width      | Usage                   |
|-----------|------------|-------------------------|
| sm        | 640px      | Mobile landscape        |
| md        | 768px      | Tablet                  |
| lg        | 1024px     | Desktop                 |
| xl        | 1280px     | Large desktop           |
| 2xl       | 1536px     | Extra large             |

### Responsive Classes
```html
<div class="flex flex-col md:flex-row lg:flex-col">
  <button class="px-4 py-2 sm:px-6 sm:py-3">
  <p class="text-sm md:text-base lg:text-lg">
```

## 6. Form Styling

```html
<!-- Input -->
<input class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />

<!-- Select -->
<select class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white" />

<!-- Textarea -->
<textarea class="w-full px-3 py-2 border border-gray-300 rounded-lg min-h-[100px]" />

<!-- Button -->
<button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" />
<button class="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50" />
```

## 7. Layout Classes

```html
<!-- App Layout -->
<div class="flex h-screen">
  <!-- Sidebar -->
  <aside class="w-64 flex-shrink-0 bg-white border-r" />

  <!-- Main content -->
  <main class="flex-1 overflow-auto">
    <div class="p-6">
    </div>
  </main>
</div>
```

## 8. Table Styling

```html
<table class="w-full border-collapse">
  <thead>
    <tr class="bg-gray-50 border-b">
      <th class="px-4 py-3 text-left text-sm font-medium">
    </tr>
  </thead>
  <tbody class="divide-y">
    <tr class="hover:bg-gray-50">
      <td class="px-4 py-3">
    </tr>
  </tbody>
</table>
```

## 9. Utility Classes Used

| Class          | Effect                  |
|---------------|-------------------------|
| `.app-loading` | Loading overlay         |
| `.spinner-lg`  | Large spinner animation |
| `.flex`        | Flexbox container       |
| `.grid`        | CSS Grid container      |
| `.p-4`         | Padding (1rem)          |
| `.m-2`         | Margin (0.5rem)         |
| `.rounded-lg`  | Large border radius     |
| `.shadow-md`   | Medium shadow           |
| `.bg-white`    | White background        |
| `.text-gray-900` | Dark text             |
