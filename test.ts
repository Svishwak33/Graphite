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
`;
console.log(renderMermaidSVG(code));
