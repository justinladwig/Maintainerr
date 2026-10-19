import { Mocked, TestBed } from '@suites/unit';
import { PlexApiService } from '../../api/plex-api/plex-api.service';
import { PlexOverlayProvider } from './plex-overlay.provider';

describe('PlexOverlayProvider', () => {
  let provider: PlexOverlayProvider;
  let plexApi: Mocked<PlexApiService>;

  beforeEach(async () => {
    const { unit, unitRef } =
      await TestBed.solitary(PlexOverlayProvider).compile();

    provider = unit;
    plexApi = unitRef.get(PlexApiService);
  });

  describe('getRandomItem', () => {
    it('maps plexId to itemId on the returned preview DTO', async () => {
      plexApi.getRandomLibraryItem.mockResolvedValue({
        plexId: 'rk-42',
        title: 'Item Title',
      });

      await expect(provider.getRandomItem(['lib-1'])).resolves.toEqual({
        itemId: 'rk-42',
        title: 'Item Title',
      });
      expect(plexApi.getRandomLibraryItem).toHaveBeenCalledWith(['lib-1']);
    });
  });

  describe('downloadImage', () => {
    it('chains getBestPosterUrl → downloadPoster', async () => {
      plexApi.getBestPosterUrl.mockResolvedValue('/library/metadata/42/thumb');
      const buf = Buffer.from('jpeg-bytes');
      plexApi.downloadPoster.mockResolvedValue(buf);

      await expect(provider.downloadImage('42')).resolves.toBe(buf);
      expect(plexApi.downloadPoster).toHaveBeenCalledWith(
        '/library/metadata/42/thumb',
      );
    });

    it('returns null when the item has no thumb URL', async () => {
      plexApi.getBestPosterUrl.mockResolvedValue(null);
      await expect(provider.downloadImage('42')).resolves.toBeNull();
      expect(plexApi.downloadPoster).not.toHaveBeenCalled();
    });
  });

  describe('uploadImage', () => {
    it('delegates to setThumb', async () => {
      const buf = Buffer.from('jpeg-bytes');
      plexApi.setThumb.mockResolvedValue(undefined);

      await provider.uploadImage('42', buf, 'image/jpeg');

      expect(plexApi.setThumb).toHaveBeenCalledWith('42', buf, 'image/jpeg');
    });
  });

  describe('landscape slot (unsupported on Plex)', () => {
    it('rejects downloadImage for the landscape slot without calling PlexApiService', async () => {
      await expect(provider.downloadImage('42', 'landscape')).rejects.toThrow(
        /not supported on Plex/,
      );
      expect(plexApi.getBestPosterUrl).not.toHaveBeenCalled();
    });

    it('rejects uploadImage for the landscape slot without calling PlexApiService', async () => {
      const buf = Buffer.from('jpeg-bytes');

      await expect(
        provider.uploadImage('42', buf, 'image/jpeg', 'landscape'),
      ).rejects.toThrow(/not supported on Plex/);
      expect(plexApi.setThumb).not.toHaveBeenCalled();
    });
  });
});
