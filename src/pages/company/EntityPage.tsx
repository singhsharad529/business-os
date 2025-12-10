import { useParams } from "react-router-dom";
import { EntityList } from "./EntityList";

export const EntityPage = () => {
    const { entityType } = useParams();
    if (!entityType) return null;

    // Convert slug → Title Case
    const templateName = entityType.charAt(0).toUpperCase() + entityType.slice(1);

    return <EntityList templateName={templateName} />;
};
