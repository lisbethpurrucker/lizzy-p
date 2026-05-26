import { groq } from 'next-sanity'

// ─── Site Settings ───────────────────────────────────────────────────────────
export const getSiteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    heroPoemText,
    homeCopy,
    logoPlaceholderText,
    contactIntroCopy,
    email,
    footerText,
    coverImage,
    aboutTagline,
    aboutPhotos[] {
      image,
      caption
    },
    "cvUrl": cv.asset->url
  }
`

// ─── Categories ──────────────────────────────────────────────────────────────
export const getCategoriesQuery = groq`
  *[_type == "category"] | order(order asc) {
    _id,
    name,
    introLine,
    "slug": slug.current,
    order
  }
`

// ─── Projects by category ────────────────────────────────────────────────────
export const getProjectsByCategoryQuery = groq`
  *[_type == "project" && category->slug.current == $categorySlug] | order(order asc) {
    _id,
    title,
    coverImage,
    description,
    tags,
    externalLink,
    gallery,
    publishedAt
  }
`

// ─── All projects (with category slug) ──────────────────────────────────────
export const getAllProjectsQuery = groq`
  *[_type == "project"] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    "categorySlug": category->slug.current,
    projectType,
    shortDescription,
    coverImage,
    "coverImageUrl": coverImage.asset->url,
    "gallery": gallery[] { "url": asset->url, "w": asset->metadata.dimensions.width, "h": asset->metadata.dimensions.height },
    "videoFile": videoFile { "url": asset->url },
    videoUrl,
    tags,
    externalLink,
    publishedAt
  }
`

// ─── Single project by slug ──────────────────────────────────────────────────
export const getProjectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    "categorySlug": category->slug.current,
    "categoryName": category->name,
    projectType,
    shortDescription,
    tagline,
    role,
    yearStart,
    yearEnd,
    status,
    coverImage,
    "videoFile": videoFile { asset->{ url } },
    videoUrl,
    "gallery": gallery[] { asset->{ url, metadata { dimensions } }, hotspot, crop },
    theWhy,
    theHow,
    whatILearned,
    description,
    tags,
    externalLink,
    studioMission,
    studioOffer,
    studioPartner,
    publishedAt
  }
`

// ─── All project slugs in a category (for pagination) ────────────────────────
export const getProjectSlugsByCategoryQuery = groq`
  *[_type == "project" && category->slug.current == $categorySlug] | order(order asc) {
    "slug": slug.current,
    title
  }
`

// ─── Poems ───────────────────────────────────────────────────────────────────
export const getAllPoemsQuery = groq`
  *[_type == "poem"] | order(order asc) {
    _id,
    title,
    body,
    publishedAt
  }
`

// ─── OMM entries (paginated) ─────────────────────────────────────────────────
// Pass { start: number, end: number } — uses exclusive-end slice [...].
export const getOmmEntriesQuery = groq`
  *[_type == "ommEntry"] | order(publishedAt desc) [$start...$end] {
    _id,
    publishedAt,
    entryType,
    image,
    caption,
    quoteText,
    attribution,
    url,
    linkTitle,
    linkDescription,
    linkImage,
    videoUrl,
    "videoFile": videoFile { asset->{ url } },
    "audioFile": audioFile { asset->{ url } }
  }
`

// ─── OMM total count ─────────────────────────────────────────────────────────
export const getOmmEntryCountQuery = groq`count(*[_type == "ommEntry"])`

// ─── Speaking Settings ───────────────────────────────────────────────────────
export const getSpeakingSettingsQuery = groq`
  *[_type == "speakingSettings"][0] {
    intro,
    topics,
    ctaText,
    ctaEmail
  }
`

// ─── Substack Settings ───────────────────────────────────────────────────────
export const getSubstackSettingsQuery = groq`
  *[_type == "substackSettings"][0] {
    name,
    tagline,
    rssUrl,
    additionalRssUrls,
    filterAuthor
  }
`

// ─── Social Links ────────────────────────────────────────────────────────────
export const getSocialLinksQuery = groq`
  *[_type == "socialLink"] | order(order asc) {
    _id,
    label,
    url
  }
`
