import { defineField, defineType } from 'sanity'
import {ImageIcon, ThListIcon} from '@sanity/icons'

export default defineType({
  name: 'press',
  title: 'Press',
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
      name: 'seo',
      title: 'SEO',
    },
  ],
  fields: [
    defineField({
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().error('Title is required'),
      group: 'content',
    }),
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
      name: 'postSummary',
      title: 'Post Summary',
      description: 'A brief summary of the press release. This will be used as the preview text.',
      type: 'text',
      rows: 4,
      group: 'content',
    }),
    defineField({
      name: 'externalLink',
      title: 'External Story Link',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'postBody',
      title: 'Post Body',
      description: 'The main content of the press release. You can add text, images, videos, and custom components.',
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
          icon: ImageIcon,
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
          type: 'codeEmbed',
        },
        {
          type: 'table',
          icon: ThListIcon,
        },
      ],
      group: 'content',
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
    })
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'postSummary',
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