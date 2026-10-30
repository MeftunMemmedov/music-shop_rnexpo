import { Product } from '@/types';
import { db } from './db';

const MAX_DB_LIMIT = 16;

export const trimProductsDB = (limit: number = MAX_DB_LIMIT) => {
  db.runSync(
    `DELETE FROM products 
     WHERE id NOT IN (
       SELECT id FROM products 
       ORDER BY updated_at DESC 
       LIMIT ?
     )`,
    [limit],
  );
};

export const saveProductToDB = (product: Product) => {
  const timestamp = Date.now();

  db.runSync(
    `INSERT INTO products (id, slug, title, images, category, brand, price, final_price, discount, description, is_featured, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       slug=excluded.slug,
       title=excluded.title,
       images=excluded.images,
       category=excluded.category,
       brand=excluded.brand,
       price=excluded.price,
       final_price=excluded.final_price,
       discount=excluded.discount,
       description=excluded.description,
       is_featured=excluded.is_featured,
       updated_at=excluded.updated_at`,
    [
      product.id,
      product.slug,
      product.title,
      JSON.stringify(product.images),
      JSON.stringify(product.category),
      JSON.stringify(product.brand),
      product.price,
      product.final_price,
      product.discount,
      product.description,
      product.is_featured ? 1 : 0,
      timestamp,
    ],
  );

  trimProductsDB(MAX_DB_LIMIT);
};

export const saveProductsToDB = (products: Product[]) => {
  if (!products || products.length === 0) return;

  const timestamp = Date.now();

  db.withTransactionSync(() => {
    for (const product of products) {
      db.runSync(
        `INSERT INTO products (id, slug, title, images, category, brand, price, final_price, discount, description, is_featured, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           slug=excluded.slug,
           title=excluded.title,
           images=excluded.images,
           category=excluded.category,
           brand=excluded.brand,
           price=excluded.price,
           final_price=excluded.final_price,
           discount=excluded.discount,
           description=excluded.description,
           is_featured=excluded.is_featured`,
        [
          product.id,
          product.slug,
          product.title,
          JSON.stringify(product.images),
          JSON.stringify(product.category),
          JSON.stringify(product.brand),
          product.price,
          product.final_price,
          product.discount,
          product.description,
          product.is_featured ? 1 : 0,
          timestamp,
        ],
      );
    }
  });

  trimProductsDB(MAX_DB_LIMIT);
};

export const getFeaturedProductsFromDB = (): Product[] => {
  const rows = db.getAllSync(
    `SELECT * FROM products WHERE is_featured = 1 ORDER BY updated_at DESC`,
  ) as Product[];
  return parseRows(rows);
};

export const getProductBySlugFromDB = (slug: string): Product | null => {
  const row = db.getFirstSync(`SELECT * FROM products WHERE slug = ?`, [
    slug,
  ]) as Product;
  if (!row) return null;
  return parseRow(row);
};

const parseRow = (row: any): Product => ({
  ...row,
  images: JSON.parse(row.images),
  category: JSON.parse(row.category),
  brand: JSON.parse(row.brand),
  is_featured: Boolean(row.is_featured),
});

const allowed_order_by: Record<string, string> = {
  'title.asc': 'title ASC',
  'title.desc': 'title DESC',
  'final_price.asc': 'final_price ASC',
  'final_price.desc': 'final_price DESC',
};

const getOrderByClause = (orderQuery?: string) => {
  if (orderQuery && allowed_order_by[orderQuery]) {
    return `${allowed_order_by[orderQuery]}, updated_at DESC`;
  }

  return 'updated_at DESC';
};

export const getAllProductsFromDB = (orderQuery?: string): Product[] => {
  const orderBy = getOrderByClause(orderQuery);
  const rows = db.getAllSync(
    `SELECT * FROM products ORDER BY ${orderBy}`,
  ) as Product[];
  return parseRows(rows);
};

export const getProductsByCategoryFromDB = (
  categorySlugs: string | string[],
  orderQuery?: string,
): Product[] => {
  const slugs = Array.isArray(categorySlugs) ? categorySlugs : [categorySlugs];

  if (slugs.length === 0) return [];

  const conditions = slugs.map(() => `category LIKE ?`).join(' OR ');
  const params = slugs.map((slug) => `%${slug}%`);
  const orderBy = getOrderByClause(orderQuery);

  const rows = db.getAllSync(
    `SELECT * FROM products WHERE (${conditions}) ORDER BY ${orderBy}`,
    params,
  ) as Product[];

  return parseRows(rows);
};

const parseRows = (rows: Product[]): Product[] => rows.map(parseRow);

export const initProductDB = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      images TEXT NOT NULL,
      category TEXT NOT NULL,
      brand TEXT NOT NULL,
      price REAL NOT NULL,
      final_price REAL NOT NULL,
      discount REAL NOT NULL,
      description TEXT NOT NULL,
      is_featured INTEGER NOT NULL,
      updated_at INTEGER
    );
  `);
};

// import { Product } from '@/types';
// import { db } from './db';

// const MAX_DB_LIMIT = 30;

// export const trimProductsDB = (limit: number = MAX_DB_LIMIT) => {
//   db.runSync(
//     `DELETE FROM products
//      WHERE id NOT IN (
//        SELECT id FROM products
//        ORDER BY updated_at DESC
//        LIMIT ?
//      )`,
//     [limit],
//   );
// };

// export const saveProductToDB = (product: Product) => {
//   const timestamp = Date.now();

//   db.runSync(
//     `INSERT INTO products (id, slug, title, images, category, brand, price, discount, description, is_featured, updated_at)
//      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//      ON CONFLICT(id) DO UPDATE SET
//        slug=excluded.slug,
//        title=excluded.title,
//        images=excluded.images,
//        category=excluded.category,
//        brand=excluded.brand,
//        price=excluded.price,
//        discount=excluded.discount,
//        description=excluded.description,
//        is_featured=excluded.is_featured,
//        updated_at=excluded.updated_at`,
//     [
//       product.id,
//       product.slug,
//       product.title,
//       JSON.stringify(product.images),
//       JSON.stringify(product.category),
//       JSON.stringify(product.brand),
//       product.price,
//       product.discount,
//       product.description,
//       product.is_featured ? 1 : 0,
//       timestamp,
//     ],
//   );

//   trimProductsDB(MAX_DB_LIMIT);
// };

// export const saveProductsToDB = (products: Product[]) => {
//   if (!products || products.length === 0) return;

//   db.withTransactionSync(() => {
//     for (const product of products) {
//       db.runSync(
//         `INSERT INTO products (id, slug, title, images, category, brand, price, discount, description, is_featured, updated_at)
//          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
//          ON CONFLICT(id) DO UPDATE SET
//            slug=excluded.slug,
//            title=excluded.title,
//            images=excluded.images,
//            category=excluded.category,
//            brand=excluded.brand,
//            price=excluded.price,
//            discount=excluded.discount,
//            description=excluded.description,
//            is_featured=excluded.is_featured`,
//         [
//           product.id,
//           product.slug,
//           product.title,
//           JSON.stringify(product.images),
//           JSON.stringify(product.category),
//           JSON.stringify(product.brand),
//           product.price,
//           product.discount,
//           product.description,
//           product.is_featured ? 1 : 0,
//         ],
//       );
//     }
//   });

//   trimProductsDB(MAX_DB_LIMIT);
// };

// export const getFeaturedProductsFromDB = (): Product[] => {
//   const rows = db.getAllSync(
//     `SELECT * FROM products WHERE is_featured = 1 ORDER BY updated_at DESC`,
//   ) as Product[];
//   return parseRows(rows);
// };

// export const getProductsByCategoryFromDB = (
//   categorySlugs: string | string[],
// ): Product[] => {
//   const slugs = Array.isArray(categorySlugs) ? categorySlugs : [categorySlugs];

//   if (slugs.length === 0) return [];

//   const conditions = slugs.map(() => `category LIKE ?`).join(' OR ');
//   const params = slugs.map((slug) => `%${slug}%`);

//   const rows = db.getAllSync(
//     `SELECT * FROM products WHERE (${conditions}) ORDER BY updated_at DESC`,
//     params,
//   ) as Product[];

//   return parseRows(rows);
// };

// export const getProductBySlugFromDB = (slug: string): Product | null => {
//   const row = db.getFirstSync(`SELECT * FROM products WHERE slug = ?`, [
//     slug,
//   ]) as Product;
//   if (!row) return null;
//   return parseRow(row);
// };

// const parseRow = (row: any): Product => ({
//   ...row,
//   images: JSON.parse(row.images),
//   category: JSON.parse(row.category),
//   brand: JSON.parse(row.brand),
//   is_featured: Boolean(row.is_featured),
// });

// export const getAllProductsFromDB = (): Product[] => {
//   const rows = db.getAllSync(
//     `SELECT * FROM products ORDER BY updated_at DESC`,
//   ) as Product[];
//   return parseRows(rows);
// };

// const parseRows = (rows: Product[]): Product[] => rows.map(parseRow);

// export const initProductDB = () => {
//   db.execSync(`
//     CREATE TABLE IF NOT EXISTS products (
//       id TEXT PRIMARY KEY NOT NULL,
//       slug TEXT UNIQUE NOT NULL,
//       title TEXT NOT NULL,
//       images TEXT NOT NULL,
//       category TEXT NOT NULL,
//       brand TEXT NOT NULL,
//       price REAL NOT NULL,
//       discount REAL NOT NULL,
//       description TEXT NOT NULL,
//       is_featured INTEGER NOT NULL,
//       updated_at INTEGER
//     );
//   `);
// };

// // import { Product } from '@/types';
// // import { db } from './db';

// // const MAX_DB_LIMIT = 30;

// // export const trimProductsDB = (limit: number = MAX_DB_LIMIT) => {
// //   db.runSync(
// //     `DELETE FROM products
// //      WHERE id NOT IN (
// //        SELECT id FROM products
// //        ORDER BY updated_at DESC
// //        LIMIT ?
// //      )`,
// //     [limit],
// //   );
// // };

// // export const saveProductToDB = (product: Product) => {
// //   db.runSync(
// //     `INSERT OR REPLACE INTO products (id, slug, title, images, category, brand, price, discount, description, is_featured, updated_at)
// //      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
// //     [
// //       product.id,
// //       product.slug,
// //       product.title,
// //       JSON.stringify(product.images),
// //       JSON.stringify(product.category),
// //       JSON.stringify(product.brand),
// //       product.price,
// //       product.discount,
// //       product.description,
// //       product.is_featured ? 1 : 0,
// //       Date.now(),
// //     ],
// //   );
// //   trimProductsDB(6);
// // };

// // export const saveProductsToDB = (products: Product[]) => {
// //   if (!products || products.length === 0) return;
// //   db.withTransactionSync(() => {
// //     for (const product of products) {
// //       saveProductToDB(product);
// //     }
// //   });
// //   trimProductsDB(6);
// // };

// // export const getFeaturedProductsFromDB = (): Product[] => {
// //   const rows = db.getAllSync(
// //     `SELECT * FROM products WHERE is_featured = 1`,
// //   ) as Product[];
// //   return parseRows(rows);
// // };

// // export const getProductsByCategoryFromDB = (
// //   categorySlugs: string | string[],
// // ): Product[] => {
// //   const slugs = Array.isArray(categorySlugs) ? categorySlugs : [categorySlugs];

// //   if (slugs.length === 0) return [];

// //   const conditions = slugs.map(() => `category LIKE ?`).join(' OR ');
// //   const params = slugs.map((slug) => `%${slug}%`);

// //   const rows = db.getAllSync(
// //     `SELECT * FROM products WHERE (${conditions}) ORDER BY updated_at DESC`,
// //     params,
// //   ) as Product[];

// //   return parseRows(rows);
// // };
// // export const getProductBySlugFromDB = (slug: string): Product | null => {
// //   const row = db.getFirstSync(`SELECT * FROM products WHERE slug = ?`, [
// //     slug,
// //   ]) as Product;
// //   if (!row) return null;
// //   return parseRow(row);
// // };

// // const parseRow = (row: any): Product => ({
// //   ...row,
// //   images: JSON.parse(row.images),
// //   category: JSON.parse(row.category),
// //   brand: JSON.parse(row.brand),
// //   is_featured: Boolean(row.is_featured),
// // });

// // export const getAllProductsFromDB = (): Product[] => {
// //   const rows = db.getAllSync(
// //     `SELECT * FROM products ORDER BY updated_at DESC`,
// //   ) as Product[];
// //   return parseRows(rows);
// // };

// // const parseRows = (rows: Product[]): Product[] => rows.map(parseRow);

// // export const initProductDB = () => {
// //   db.execSync(`
// //     CREATE TABLE IF NOT EXISTS products (
// //       id TEXT PRIMARY KEY NOT NULL,
// //       slug TEXT UNIQUE NOT NULL,
// //       title TEXT NOT NULL,
// //       images TEXT NOT NULL,
// //       category TEXT NOT NULL,
// //       brand TEXT NOT NULL,
// //       price REAL NOT NULL,
// //       discount REAL NOT NULL,
// //       description TEXT NOT NULL,
// //       is_featured INTEGER NOT NULL,
// //       updated_at INTEGER
// //     );
// //   `);
// // };
