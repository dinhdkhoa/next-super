import dishesAPI from "@/apiRequests/dishes"
import envConfig from "@/config"
import { locales } from "@/i18n/i18n"
import { slugifyDish } from "@/lib/utils"
import type { MetadataRoute } from "next"

const staticRoutes: MetadataRoute.Sitemap = [
  {
    url: "",
    changeFrequency: "daily",
    priority: 1
  },
  {
    url: "/login",
    changeFrequency: "yearly",
    priority: 0.5
  }
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const result = await dishesAPI.getDishes()

  const dishList = result.payload.data
  const localizeStaticSiteMap = locales.reduce((acc, locale) => {
    return [
      ...acc,
      ...staticRoutes.map((route) => {
        return {
          ...route,
          url: `${envConfig.NEXT_PUBLIC_URL}/${locale}${route.url}`,
          lastModified: new Date()
        }
      })
    ]
  }, [] as MetadataRoute.Sitemap)
  const localizeDishSiteMap = locales.reduce((acc, locale) => {
    const dishListSiteMap: MetadataRoute.Sitemap = dishList.map((dish) => {
      return {
        url: `${envConfig.NEXT_PUBLIC_URL}/${locale}/dishes/${slugifyDish( dish.name ,dish.id)}`,
        lastModified: dish.updatedAt,
        changeFrequency: "weekly",
        priority: 0.9
      }
    })
    return [...acc, ...dishListSiteMap]
  }, [] as MetadataRoute.Sitemap)
  return [...localizeStaticSiteMap, ...localizeDishSiteMap]
}
