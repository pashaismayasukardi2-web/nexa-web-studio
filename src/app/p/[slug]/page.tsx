import { initialPageConfig } from '../../../data/templates';
import { CanvasArea } from '../../../components/studio/CanvasArea';
import { Metadata } from 'next';

interface PublicPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PublicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const brandName = slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return {
    title: `${brandName} — Halaman Resmi Pendaftaran`,
    description: initialPageConfig.metaDescription,
  };
}

export default async function PublicTenantPage({ params }: PublicPageProps) {
  await params;

  return (
    <CanvasArea
      blocks={initialPageConfig.blocks}
      selectedBlockId={null}
      onSelectBlock={() => {}}
      device="desktop"
      isLivePreview={true}
      theme={initialPageConfig.theme}
      tenantType={initialPageConfig.tenantType}
      isPublicPage={true}
    />
  );
}

