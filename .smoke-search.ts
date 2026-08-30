import 'tsconfig-paths/register';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { PostgresRagService } from './apps/api/src/modules/rag/services/postgres-rag.service';

const adapter = new PrismaPg({ connectionString: 'postgresql://areyes:root@localhost:5432/modu' });
const prisma = new PrismaClient({ adapter });

async function main() {
  const svc = new PostgresRagService(prisma as never);

  const target = await prisma.$queryRaw<{
    document_id: bigint; chunk_index: number; content: string; embedding: string;
  }[]>`
    SELECT dc.document_id, dc.chunk_index, dc.content, dc.embedding::text AS embedding
    FROM document_chunks dc
    JOIN documents d ON d.id = dc.document_id
    WHERE dc.embedding IS NOT NULL AND d.title ILIKE '%compras%'
    ORDER BY dc.chunk_index
    LIMIT 1
  `;
  const src = target[0];
  const q = JSON.parse(src.embedding);
  console.log('=== QUERY (origen) ===');
  console.log('docId:', Number(src.document_id), 'chunkIndex:', src.chunk_index);
  console.log('contenido:', src.content.slice(0, 100).replace(/\r\n/g, ' '));
  console.log('dims:', q.length);

  console.log('\n=== searchVector (top 5 más similares) ===');
  const res = await svc.searchVector({ embedding: q, limit: 5 });
  res.chunks.forEach((c, i) => {
    console.log(`#${i + 1} score=${c.score.toFixed(4)} dist=${c.distance.toFixed(4)} dept=${c.department} doc=${c.documentId}`);
    console.log(`   [${(c.documentTitle ?? '').slice(0, 60)}]`);
    console.log(`   ${c.content.slice(0, 90).replace(/\r\n/g, ' ')}`);
  });
}

main().finally(() => prisma.$disconnect());
