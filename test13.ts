import { renderMermaidSVG } from 'beautiful-mermaid';
const code = `graph TD
  subgraph Cluster Communication Architecture
    subgraph CONTROL PLANE
      A[gRPC over TCP]
      B[Consensus]
    end
    subgraph DATA PLANE
      C[Custom binary over raw TCP]
      D[Bulk data transfer]
    end
    subgraph ENCRYPTION [ENCRYPTION]
      E[mTLS with kTLS offload]
      F[Kernel-space encryption]
    end
  end
  
  CONTROL_PLANE --> DATA_PLANE
  DATA_PLANE --> ENCRYPTION
`;
try {
  console.log(renderMermaidSVG(code));
} catch (e: any) {
  console.error(e.message);
}
