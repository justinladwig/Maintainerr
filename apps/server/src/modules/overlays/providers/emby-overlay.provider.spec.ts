import { Mocked, TestBed } from '@suites/unit';
import { EmbyAdapterService } from '../../api/media-server/emby/emby-adapter.service';
import { EmbyOverlayProvider } from './emby-overlay.provider';

describe('EmbyOverlayProvider', () => {
  let provider: EmbyOverlayProvider;
  let emby: Mocked<EmbyAdapterService>;

  beforeEach(async () => {
    const { unit, unitRef } =
      await TestBed.solitary(EmbyOverlayProvider).compile();

    provider = unit;
    emby = unitRef.get(EmbyAdapterService);
  });

  describe('uploadImage', () => {
    it('delegates to EmbyAdapterService.setCollectionImage with the Primary image type by default', async () => {
      const buf = Buffer.from('poster');
      emby.setCollectionImage.mockResolvedValue(undefined);

      await provider.uploadImage('42', buf, 'image/jpeg');

      expect(emby.setCollectionImage).toHaveBeenCalledWith(
        '42',
        buf,
        'image/jpeg',
        'Primary',
      );
    });

    it('uploads to the Thumb image type for the landscape slot', async () => {
      const buf = Buffer.from('tile');
      emby.setCollectionImage.mockResolvedValue(undefined);

      await provider.uploadImage('42', buf, 'image/jpeg', 'landscape');

      expect(emby.setCollectionImage).toHaveBeenCalledWith(
        '42',
        buf,
        'image/jpeg',
        'Thumb',
      );
    });
  });

  describe('downloadImage', () => {
    it('reads the Primary image type by default', async () => {
      const buf = Buffer.from('poster');
      emby.getItemImageBuffer.mockResolvedValue(buf);

      const result = await provider.downloadImage('42');

      expect(emby.getItemImageBuffer).toHaveBeenCalledWith('42', 'Primary');
      expect(result).toBe(buf);
    });

    it('reads the Thumb image type for the landscape slot', async () => {
      const buf = Buffer.from('tile');
      emby.getItemImageBuffer.mockResolvedValue(buf);

      const result = await provider.downloadImage('42', 'landscape');

      expect(emby.getItemImageBuffer).toHaveBeenCalledWith('42', 'Thumb');
      expect(result).toBe(buf);
    });
  });
});
