import {
  OverlayLibrarySection,
  OverlayPreviewItem,
} from '@maintainerr/contracts';

/**
 * Which image slot on the item an overlay operation targets.
 *
 * `poster` is the existing `Primary` image (poster for movies/shows, still
 * for episodes). `landscape` is the 16:9 image Jellyfin/Emby's grid "Tile"
 * layout shows for movies/shows (Jellyfin/Emby's `Thumb` image type). Plex
 * has no equivalent per-item asset, so `landscape` is unreachable there -
 * gated by `MediaServerFeature.OVERLAY_LANDSCAPE_IMAGE` before any caller
 * requests it.
 */
export type OverlayImageSlot = 'poster' | 'landscape';

/**
 * Server-agnostic contract for overlay-specific media-server interactions.
 *
 * Intentionally narrower than IMediaServerService - overlays are a feature,
 * not a core media-server responsibility, so the I/O and editor helpers the
 * overlay module needs live here. The overlay processor, controller, and
 * editor UI depend on this interface only; each supported media server
 * provides its own implementation in this directory.
 */
export interface IOverlayProvider {
  /**
   * True when the configured media server backing this provider is
   * initialised and ready to service overlay operations. Mirrors
   * IMediaServerService.isSetup() at the provider level.
   */
  isAvailable(): Promise<boolean>;

  /**
   * Library sections suitable for the overlay editor's section picker.
   * Returns only movie and show libraries - music / photos etc. never carry
   * overlay-worthy artwork in this feature.
   */
  getSections(): Promise<OverlayLibrarySection[]>;

  /**
   * Pick a random movie or show from the given section keys (or across all
   * movie/show sections when omitted). Used for the editor's preview
   * background.
   */
  getRandomItem(sectionKeys?: string[]): Promise<OverlayPreviewItem | null>;

  /**
   * Pick a random episode from the given show section keys (or across all
   * show sections when omitted). Used for title-card template previews.
   */
  getRandomEpisode(sectionKeys?: string[]): Promise<OverlayPreviewItem | null>;

  /**
   * Download the artwork for `itemId` in the given slot (defaults to
   * `poster`, the existing behavior). Returns null when no artwork exists
   * for the item/slot.
   */
  downloadImage(
    itemId: string,
    slot?: OverlayImageSlot,
  ): Promise<Buffer | null>;

  /**
   * Replace the item's artwork in the given slot (defaults to `poster`).
   * Upload semantics are a provider detail (Plex: upload + diff + select
   * with content-addressed dedup; Jellyfin: atomic single-call replace).
   */
  uploadImage(
    itemId: string,
    buffer: Buffer,
    contentType: string,
    slot?: OverlayImageSlot,
  ): Promise<void>;
}
