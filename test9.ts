import { renderMermaidSVG } from 'beautiful-mermaid';
const code = `graph TD
  subgraph Cluster Communication Architecture
    subgraph DATA PLANE
    end
    subgraph CONTROL PLANE
    end
    subgraph ENCRYPTION [ENCRYPTION (if required)]
    end
  end
`;
try {
  console.log(renderMermaidSVG(code));
} catch (e: any) {
  console.error(e.message);
}
