import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  groups: [
    {
      name: 'content',
      title: 'Content',
    },
    {
      name: 'meta',
      title: 'Meta',
    },
    {
      name: 'media',
      title: 'Media',
    },
    {
      name: 'settings',
      title: 'Settings',
    },
    {
      name: 'seo',
      title: 'SEO',
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().error('Title is required'),
      group: 'content',
    }),
    // defineField({
    //   name: 'heading',
    //   title: 'Heading',
    //   type: 'localizedString',
    //   validation: (Rule) => Rule.required().error('Heading is required'),
    //   group: 'content',
    // }),
    defineField({
      name: 'slug',
      title: 'Slug',
      description: 'The URL-friendly version of the title. This will be used in the post URL.',
      type: 'slug',
      validation: (Rule) => Rule.required().error('Slug is required'),
      options: {
        source: 'title',
        maxLength: 96,
      },
      group: 'content',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      description: 'Select the category this post belongs to.',
      type: 'reference',
      to: [{ type: 'blogCategory' }],
      validation: (Rule) => Rule.required(),
      group: 'meta',
    }),
    defineField({
      name: 'postSummary',
      title: 'Post Summary',
      description: 'A brief summary of the post. This will be used as the preview text.',
      type: 'text',
      rows: 4,
      group: 'content',
    }),
    defineField({
      name: 'postBody',
      title: 'Post Body',
      description: 'The main content of the blog post. You can add text, images, videos, and custom components.',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Heading 2', value: 'h2' },
            { title: 'Heading 3', value: 'h3' },
            { title: 'Heading 4', value: 'h4' },
            { title: 'Heading 5', value: 'h5' },
            { title: 'Heading 6', value: 'h6' },
            { title: 'Quote', value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Code', value: 'code' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'string',
                    title: 'URL',
                    validation: (Rule) => {
                      return Rule.custom((value: string | undefined) => {
                        if (!value) return true;

                        // Allow relative paths starting with /
                        if (value.startsWith('/')) return true;

                        // Allow mailto: and tel: links
                        if (value.startsWith('mailto:')) return true;
                        if (value.startsWith('tel:')) return true;

                        // Validate external URLs
                        try {
                          new URL(value);
                          return true;
                        } catch {
                          return 'Please enter a valid URL, relative path (starting with /), mailto: or tel: link';
                        }
                      });
                    },
                  },
                  {
                    name: 'target',
                    type: 'string',
                    title: 'Target',
                    options: {
                      list: [
                        { title: 'Same window', value: '_self' },
                        { title: 'New window', value: '_blank' }
                      ]
                    },
                    initialValue: '_self'
                  }
                ]
              }
            ]
          }
        },
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            },
            {
              name: 'alt',
              type: 'string',
              title: 'Alt text',
            },
            {
              name: 'link',
              type: 'object',
              title: 'Image Link',
              fields: [
                {
                  name: 'href',
                  type: 'string',
                  title: 'URL',
                  validation: (Rule) => {
                    return Rule.custom((value: string | undefined) => {
                      if (!value) return true;
                      if (value.includes('mailto:')) return true;
                      if (value.includes('tel:')) return true;
                      try {
                        new URL(value);
                        return true;
                      } catch {
                        return 'Please enter a valid URL, mailto: or tel: link';
                      }
                    });
                  },
                },
                {
                  name: 'target',
                  type: 'string',
                  title: 'Target',
                  options: {
                    list: [
                      { title: 'Same window', value: '_self' },
                      { title: 'New window', value: '_blank' }
                    ]
                  },
                  initialValue: '_self'
                }
              ]
            }
          ],
        },
        {
          type: 'youTube',
        },
        {
          type: 'banner',
        },
        {
          type: 'callout',
        },
      ],
      group: 'content',
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      description: 'The main image for the post. This will be displayed at the top of the post and used for thumbnails. Recommended size: 1200x630px.',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Describe the image for accessibility and SEO purposes.',
        },
      ],
      group: 'media',
    }),
    defineField({
      name: 'popular',
      title: 'Popular',
      description: 'Mark this post as popular to feature it in popular posts sections.',
      type: 'boolean',
      initialValue: false,
      group: 'settings',
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      description: 'Mark this post as featured to display it prominently on the website.',
      type: 'boolean',
      initialValue: false,
      group: 'settings',
    }),
    defineField({
      name: 'createdOn',
      title: 'Created On',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      readOnly: true,
      group: 'meta',
    }),
    defineField({
      name: 'publishedOn',
      title: 'Published On',
      type: 'datetime',
      group: 'meta',
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'teamMember' }],
      validation: (Rule) => Rule.required(),
      description: 'Select the author of this post.',
      group: 'meta',
    }),
    defineField({
      name: 'relatedModels',
      title: 'Related Models',
      type: 'array',
      of: [
        {
          name: 'modelSlug',
          title: 'Model Slug',
          type: 'string',
        },
      ],
      group: 'settings',
    }),
    defineField({
      name: 'relatedPosts',
      title: 'Related Posts',
      description: 'Optional. By default, the system automatically displays 8 posts from the same category. You can manually curate specific related posts here to override the automatic selection.',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'blogPost' }],
          options: {
            disableNew: true,
          },
        }
      ],
      validation: (Rule) => Rule.unique(),
      group: 'settings',
    }),
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      description: 'Recommended length: 60 characters or less',
      validation: (Rule) => Rule.max(60).warning('Meta title should be shorter than 60 chars.'),
      group: 'seo',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      description: 'Recommended length: between 120 and 160 characters',
      validation: (Rule) =>
        Rule.custom((text) => {
          if (!text) return true
          if (text.length < 120) return 'Meta description should have at least 120 characters'
          if (text.length > 160) return 'Meta description should be shorter than 160 characters'
          return true
        }).warning(),
      group: 'seo',
    }),
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      group: 'meta',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'postSummary',
      media: 'featuredImage',
    },
  },
  orderings: [
    {
      title: 'Post Date, New',
      name: 'postDateDesc',
      by: [
        { field: 'publishedOn', direction: 'desc' }
      ]
    },
    {
      title: 'Post Date, Old',
      name: 'postDateAsc',
      by: [
        { field: 'publishedOn', direction: 'asc' }
      ]
    },
  ]
})