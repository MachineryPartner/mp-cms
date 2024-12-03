import { defineField, defineType } from 'sanity'
import { LANGUAGES } from '../../utils/languages'

export default defineType({
  name: 'localizedText',
  title: 'Localized Text',
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
      type: 'text',
      fieldset: lang.default ? undefined : 'translations',
    })
  ),
})
