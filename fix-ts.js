const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements) {
    const fullPath = path.join(__dirname, filePath);
    if (!fs.existsSync(fullPath)) {
        console.error(`File not found: ${fullPath}`);
        return;
    }
    let content = fs.readFileSync(fullPath, 'utf8');
    replacements.forEach(([from, to]) => {
        content = content.replace(from, to);
    });
    fs.writeFileSync(fullPath, content);
    console.log(`Updated ${filePath}`);
}

// 1. Zod Errors
const apiFiles = [
    'app/api/admin/categories/route.ts',
    'app/api/admin/categories/[id]/route.ts',
    'app/api/admin/products/route.ts',
    'app/api/admin/products/[id]/route.ts',
    'app/api/admin/settings/route.ts',
];
apiFiles.forEach(file => {
    replaceInFile(file, [[/validated\.error\.errors\[0\]/g, 'validated.error.issues[0]']]);
});

// 2. DataTable i type
replaceInFile('components/admin/DataTable.tsx', [
    ['cell?: (item: T) => React.ReactNode', 'cell?: (item: T, index: number) => React.ReactNode'],
    ['col.cell(item)', 'col.cell(item, i)']
]);

// 3. Categories page i type
replaceInFile('app/(admin)/admin/categories/page.tsx', [
    ['cell: (_, i) => (', 'cell: (_, i: number) => (']
]);

// 4. Edit product page badge type
replaceInFile('app/(admin)/admin/products/[id]/edit/page.tsx', [
    ["badge: (product.badge as string) || '',", 'badge: (product.badge as "NEW" | "HOT" | "BEST SELLER" | null | undefined),']
]);

// 5. ProductForm defaultValues and resolver schema type
replaceInFile('components/admin/ProductForm.tsx', [
    [
        `badge: initialData?.badge || '',`,
        `badge: initialData?.badge || null,`
    ],
    [
        `useForm<ProductValues>`,
        `useForm<z.infer<typeof ProductSchema>>`
    ],
    [
        `value={badge || ''}`,
        `value={badge || 'none'}`
    ],
    [
        `onValueChange={(v) => setValue('badge', v === '' ? '' : v)}`,
        `onValueChange={(v) => setValue('badge', v === 'none' ? null : (v as "NEW" | "HOT" | "BEST SELLER"))}`
    ],
    [
        `value={opt.value || ''}`,
        `value={opt.value || 'none'}`
    ]
]);
