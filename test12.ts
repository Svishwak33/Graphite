import { renderMermaidSVG } from 'beautiful-mermaid';
const code = `graph TD
  subgraph Cluster Communication Architecture
    subgraph DATA PLANE
      A
    end
    subgraph CONTROL PLANE
      B
    end
    subgraph ENCRYPTION [ENCRYPTION (if required)]
      C
    end
  end
  
  CONTROL PLANE --> DATA PLANE
  DATA PLANE --> ENCRYPTION
`;
try {
  console.log(renderMermaidSVG(code));
} catch (e: any) {
  console.error(e.message);
}
