import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
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
              S.documentTypeListItem('project').title('Projects'),
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
