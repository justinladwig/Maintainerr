import {
  ImageType,
  BaseItemKind,
} from '@jellyfin/sdk/lib/generated-client/models';
import {
  OverlayLibrarySection,
  OverlayPreviewItem,
} from '@maintainerr/contracts';
import { Injectable } from '@nestjs/common';
import { JellyfinAdapterService } from '../../api/media-server/jellyfin/jellyfin-adapter.service';
import {
  IOverlayProvider,
  OverlayImageSlot,
} from './overlay-provider.interface';

const IMAGE_TYPE_BY_SLOT: Record<OverlayImageSlot, ImageType> = {
  poster: ImageType.Primary,
  landscape: ImageType.Thumb,
};

/**
 * Jellyfin implementation of IOverlayProvider.
 *
 * `poster` reads/writes the `Primary` image: movies and shows have their
 * poster there, and episodes have their still there. `landscape` reads/writes
 * the `Thumb` image, which Jellyfin's grid "Tile" layout uses for movies/shows
 * (gated by MediaServerFeature.OVERLAY_LANDSCAPE_IMAGE - only ever requested
 * for non-episode collections).
 */
@Injectable()
export class JellyfinOverlayProvider implements IOverlayProvider {
  constructor(private readonly jf: JellyfinAdapterService) {}

  async isAvailable(): Promise<boolean> {
    return this.jf.isSetup();
  }

  async getSections(): Promise<OverlayLibrarySection[]> {
    const libs = await this.jf.getLibraries();
    const sections: OverlayLibrarySection[] = [];
    for (const l of libs) {
      if (l.type === 'movie' || l.type === 'show') {
        sections.push({ key: l.id, title: l.title, type: l.type });
      }
    }
    return sections;
  }

  async getRandomItem(
    sectionKeys?: string[],
  ): Promise<OverlayPreviewItem | null> {
    const item = await this.jf.findRandomItem(sectionKeys, [
      BaseItemKind.Movie,
      BaseItemKind.Series,
    ]);
    if (!item?.Id) return null;
    return { itemId: item.Id, title: item.Name ?? '' };
  }

  async getRandomEpisode(
    sectionKeys?: string[],
  ): Promise<OverlayPreviewItem | null> {
    const ep = await this.jf.findRandomEpisode(sectionKeys);
    if (!ep?.Id) return null;
    const name = ep.Name ?? '';
    const title = ep.SeriesName ? `${ep.SeriesName} - ${name}` : name;
    return { itemId: ep.Id, title };
  }

  async downloadImage(
    itemId: string,
    slot: OverlayImageSlot = 'poster',
  ): Promise<Buffer | null> {
    return this.jf.getItemImageBuffer(itemId, IMAGE_TYPE_BY_SLOT[slot]);
  }

  async uploadImage(
    itemId: string,
    buffer: Buffer,
    contentType: string,
    slot: OverlayImageSlot = 'poster',
  ): Promise<void> {
    await this.jf.setItemImage(
      itemId,
      IMAGE_TYPE_BY_SLOT[slot],
      buffer,
      contentType,
    );
  }
}
