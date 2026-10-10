import { getCategories } from "../lib/categories";

async function main() {
  const categories = await getCategories();

  console.log(
    JSON.stringify(
      categories.map(({ id, name, slug, is_active }) => ({
        id,
        name,
        slug,
        is_active,
      })),
      null,
      2
    )
  );
}

main().catch(console.error);
