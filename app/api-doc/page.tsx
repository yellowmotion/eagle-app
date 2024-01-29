import { getApiDocs } from '@/lib/swagger';
import ReactSwagger from '@/components/swagger/swagger';

export default async function IndexPage() {
  const spec = await getApiDocs();
  return (
    <section className="container max-md:px-2">
      <ReactSwagger spec={spec} />
    </section>
  );
}