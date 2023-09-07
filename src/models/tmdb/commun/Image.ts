import { ImageType } from "../enum";
import { Backdrop } from "./Backdrop";

export interface Image extends Backdrop {
  type: ImageType;
}
