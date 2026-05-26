import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = async (S, context) => {
  const client = context.getClient({ apiVersion: '2024-01-01' })

  // Fetch categories in order so we can build per-category project lists
  const categories: { _id: string; name: string }[] = await client.fetch(
    `*[_type == "category"] | order(order asc) { _id, name }`,
  )

  return S.list()
    .title('Content')
    .items([
      // ─── Site Settings (singleton) ──────────────────────────────
      S.listItem()
        .title('Site Settings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Site Settings'),
        ),

      S.divider(),

      // ─── My Universe ────────────────────────────────────────────
      S.listItem()
        .title('My Universe')
        .child(
          S.list()
            .title('My Universe')
            .items([
              S.documentTypeListItem('category').title('Categories'),

              // Projects grouped under each category
              S.listItem()
                .title('Projects')
                .child(
                  S.list()
                    .title('Projects by category')
                    .items([
                      // One folder per category
                      ...categories.map((cat) =>
                        S.listItem()
                          .title(cat.name)
                          .id(cat._id)
                          .child(
                            S.documentList()
                              .title(cat.name)
                              .filter(
                                '_type == "project" && category._ref == $catId',
                              )
                              .params({ catId: cat._id })
                              .defaultOrdering([
                                { field: 'order', direction: 'asc' },
                              ]),
                          ),
                      ),

                      // Catch-all for projects with no category assigned
                      S.listItem()
                        .title('— Uncategorised')
                        .id('projects-uncategorised')
                        .child(
                          S.documentList()
                            .title('Uncategorised projects')
                            .filter(
                              '_type == "project" && !defined(category)',
                            )
                            .defaultOrdering([
                              { field: 'order', direction: 'asc' },
                            ]),
                        ),
                    ]),
                ),
            ]),
        ),

      S.divider(),

      // ─── Words ──────────────────────────────────────────────────
      S.listItem()
        .title('Words')
        .child(
          S.list()
            .title('Words')
            .items([
              S.documentTypeListItem('poem').title('Poems'),
              S.listItem()
                .title('Substack Settings')
                .child(
                  S.document()
                    .schemaType('substackSettings')
                    .documentId('substackSettings')
                    .title('Substack Settings'),
                ),
              S.listItem()
                .title('Speaking Settings')
                .child(
                  S.document()
                    .schemaType('speakingSettings')
                    .documentId('speakingSettings')
                    .title('Speaking Settings'),
                ),
            ]),
        ),

      S.divider(),

      // ─── On My Mind ─────────────────────────────────────────────
      S.listItem()
        .title('On My Mind')
        .child(
          S.documentTypeList('ommEntry')
            .title('All Entries')
            .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }]),
        ),

      S.divider(),

      // ─── Social Links ────────────────────────────────────────────
      S.documentTypeListItem('socialLink').title('Social Links'),
    ])
}
