import { renderMermaidSVG } from 'beautiful-mermaid';
const code = `graph TD
  subgraph Cluster Communication Architecture
    subgraph DATA_PLANE [DATA PLANE]
      A[Custom binary over raw TCP]
      B[Bulk data transfer]
    end
    subgraph CONTROL_PLANE [CONTROL PLANE]
      C[gRPC over TCP]
      D[Consensus]
    end
    subgraph ENCRYPTION [ENCRYPTION (if required)]
      E[mTLS with kTLS offload]
      F[Kernel-space encryption]
    end
  end
  
  CONTROL_PLANE --> DATA_PLANE
  DATA_PLANE --> ENCRYPTION
  
  C --> A
  D --> B
  A --> E
  B --> F
`;
try {
  console.log(renderMermaidSVG(code));
} catch (e: any) {
  console.error(e.message);
}
