import { TokensGenerator } from "../../infra/tokens.generator/impl/tokens.generator";
import { aliasGenerator } from "./services/alias.generator";
import { linkResopitory } from "./services/link.repository";
import { LinkService } from "./services/link.service";

const linkService = new LinkService (aliasGenerator, new TokensGenerator(), linkResopitory);

export {
    linkService
};
