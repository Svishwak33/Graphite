import { renderMermaidSVG } from 'beautiful-mermaid';
const code = `graph TD
  subgraph Cluster Communication Architecture
    subgraph DATA_PLANE [DATA PLANE]
      A
    end
    subgraph CONTROL_PLANE [CONTROL PLANE]
      B
    end
    subgraph ENCRYPTION [ENCRYPTION (if required)]
      C
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
