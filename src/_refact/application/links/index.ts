import { sessionGenerator } from "../auth/services/session.generator";
import { aliasGenerator } from "./services/alias.generator";
import { linkResopitory } from "./services/link.repository";
import { LinkService } from "./services/link.service";

const linkService = new LinkService (aliasGenerator, sessionGenerator, linkResopitory);

export {
    linkService
};
