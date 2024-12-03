import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { codeInput } from '@sanity/code-input'
import { colorInput } from '@sanity/color-input'
import { schemaTypes } from './schemaTypes'
import { BookIcon, DocumentsIcon, TagIcon } from '@sanity/icons'
import { media } from 'sanity-plugin-media'
import { LANGUAGES } from './utils/languages'
import { documentInternationalization } from '@sanity/document-internationalization'

export default defineConfig({
  name: 'default',
  title: 'Machinery Partner CMS',
  projectId: 'yhrhi1m6',
  dataset: 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // Blog folder
            S.listItem()
              .title('Blog')
              .icon(BookIcon)
              .child(
                S.list()
                  .title('Blog')
                  .items([
                    S.listItem()
                      .title('Posts')
                      .icon(BookIcon)
                      .child(
                        S.list()
                          .title('Blog')
                          .items([
                            ...LANGUAGES.map((lang) =>
                              S.listItem()
                                .title(`Posts (${lang.title})`)
                                .schemaType('blogPost')
                                .icon(DocumentsIcon)
                                .id(`blogPost-${lang.id}`)
                                .child(
                                  S.documentList()
                                    .id(`blogPost-${lang.id}`)
                                    .title(`Posts (${lang.title})`)
                                    .schemaType('blogPost')
                                    .filter('_type == "blogPost" && language == $language')
                                    .params({ language: lang.id })
                                    .initialValueTemplates([
                                      S.initialValueTemplateItem('blogPost', {
                                        templateId: `blogPost-${lang.id}`,
                                        params: {
                                          language: lang.id
                                        }
                                      })
                                    ])
                                    .canHandleIntent((intentName, params) => {
                                      // TODO: Handle **existing** documents (like search results when clicked)
                                      // to return `true` on the correct language list!
                                      if (intentName === 'edit') {
                                        // return params?.language === language.id
                                        return false
                                      }

                                      // Not an initial value template
                                      if (!params.template) {
                                        return true
                                      }

                                      // Template name structure example: "lesson-en"
                                      const languageValue = params?.template?.split(`-`).pop()

                                      return languageValue === lang.id
                                    })
                                )
                            ),
                            S.divider(),
                            S.listItem()
                              .id('blogPost')
                              .title('All Posts')
                              .icon(DocumentsIcon)
                              .child(
                                S.documentList()
                                  .id('blogPost')
                                  .title('All Posts')
                                  .schemaType('blogPost')
                                  .filter('_type == "blogPost"')
                                  .canHandleIntent((intentName, params) => {
                                    return intentName === 'edit' || params.template === 'blogPost'
                                  })
                              )
                          ])
                      ),
                    S.divider(),
                    S.listItem()
                      .title('Categories')
                      .icon(TagIcon)
                      .child(
                        S.documentTypeList('blogCategory')
                      ),
                  ])
              ),
            S.divider(),
          ])

    }),
    // internationalizedArray({
    //   languages: LANGUAGES,
    //   defaultLanguages: LANGUAGES.filter(lang => lang.default).map(lang => lang.id),
    //   fieldTypes: ['string', 'text'],
    // }),
    documentInternationalization({
      supportedLanguages: LANGUAGES.map((lang) => ({
        id: lang.id,
        title: lang.title,
      })),
      schemaTypes: ['blogPost'],
    }),
    // languageFilter({
    //   supportedLanguages: LANGUAGES.map((lang) => ({
    //     id: lang.id,
    //     title: lang.title,
    //   })),
    //   defaultLanguages: ['en'],
    //   documentTypes: ['blogPost'],
    //   filterField: (enclosingType, member, selectedLanguageIds) => {
    //     console.log(enclosingType, member, selectedLanguageIds)
    //     return !enclosingType.name.startsWith('locale') || selectedLanguageIds.includes(member.name)
    //   }
    // }),
    media(),
    visionTool(),
    codeInput(),
    colorInput()
  ],
  schema: {
    types: schemaTypes,
  },
})