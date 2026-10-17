import LeadDetailPage, { generateMetadata as leadMetadata } from '../lead/[token]/page';

export const dynamic = 'force-dynamic';
export const generateMetadata = leadMetadata;
export default LeadDetailPage;
