import adzap from "../assets/events/adzap.png";
import debate from "../assets/events/debate.png";
import unoMinuto from "../assets/events/uno-minuto.png";
import puzzle from "../assets/events/puzzle.png";
import drama from "../assets/events/drama.png";
import quiz from "../assets/events/quiz.png";
import jam from "../assets/events/jam.png";
import shipwreck from "../assets/events/shipwreck.png";
import poem from "../assets/events/poem.png";
import microtale from "../assets/events/microtale.png";

const eventImages = {
  adzap,
  debate,
  "uno-minuto": unoMinuto,
  puzzle,
  drama,
  quiz,
  jam,
  shipwreck,
  poem,
  microtale,
};

export default eventImages;

export function resolveEventImage(imageKey) {
  if (!imageKey) return null;
  if (/^https?:\/\//i.test(imageKey)) return imageKey;
  return eventImages[imageKey] ?? null;
}
