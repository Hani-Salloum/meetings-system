
'use client'

import { useTranslations } from "next-intl"

interface PageTitleProps {
  title: string
  description: string
}

const PageTitle = ({ title, description }: PageTitleProps) => {
  const t = useTranslations()

  return (
    <div className="mb-8 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">{t(title)}</h1>
      <p className="text-lg font-medium">{ t(description) }</p>
    </div>
  )
}

export default PageTitle