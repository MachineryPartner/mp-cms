import { defineField, defineType } from 'sanity'
import { LANGUAGES } from '../../utils/languages'

export default defineType({
  name: 'localizedSlug',
  title: 'Localized Slug',
  type: 'object',
  fieldsets: [
    {
      title: 'Translations',
      name: 'translations',
      options: { collapsible: true, collapsed: false },
    },
  ],
  fields: LANGUAGES.map((lang) =>
    defineField({
      name: lang.id,
      title: lang.title,
      type: 'slug',
      fieldset: lang.default ? undefined : 'translations',
      options: {
        source: `title.${lang.id}`,
      },
    })
  ),
})
