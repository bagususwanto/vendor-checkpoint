import { Test, TestingModule } from '@nestjs/testing';
import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  jest,
} from '@jest/globals';
import { ChecklistService } from './checklist.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { VendorCategoryService } from '../vendor_category/vendor_category.service';
import { BadRequestException } from '@nestjs/common';

describe('ChecklistService', () => {
  let service: ChecklistService;
  let prisma: PrismaService;
  let vendorCategoryService: VendorCategoryService;

  const mockPrismaService = {
    mst_checklist_category: {
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    mst_checklist_item: {
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  const mockVendorCategoryService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChecklistService,
        { provide: PrismaService, useValue: mockPrismaService },
        {
          provide: VendorCategoryService,
          useValue: mockVendorCategoryService,
        },
      ],
    }).compile();

    service = module.get<ChecklistService>(ChecklistService);
    prisma = module.get<PrismaService>(PrismaService);
    vendorCategoryService = module.get<VendorCategoryService>(
      VendorCategoryService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllCategories', () => {
    it('should return categories with items sorted correctly (general first)', async () => {
      const mockItems = [
        {
          checklist_item_id: 1,
          item_text: 'Special Item',
          item_type: 'KHUSUS', // Special
          display_order: 1,
        },
        {
          checklist_item_id: 2,
          item_text: 'General Item',
          item_type: 'UMUM', // General
          display_order: 2,
        },
      ];
      const mockCategory = {
        checklist_category_id: 1,
        category_name: 'Test Cat',
        mst_checklist_item: mockItems,
      };

      (
        prisma.mst_checklist_category.findMany as jest.Mock<any>
      ).mockResolvedValue([mockCategory]);

      const result = await service.findAllCategories();

      expect(result[0].mst_checklist_item[0].checklist_item_id).toBe(2); // General First
      expect(result[0].mst_checklist_item[1].checklist_item_id).toBe(1); // Special Last
    });
  });

  describe('createCategory', () => {
    it('should create a new category', async () => {
      const dto = {
        category_name: 'Test Cat',
        category_code: 'TEST',
        display_order: 1,
        is_active: true,
      };
      (
        prisma.mst_checklist_category.create as jest.Mock<any>
      ).mockResolvedValue(dto);

      const result = await service.createCategory(dto);
      expect(result).toEqual(dto);
      expect(prisma.mst_checklist_category.create).toHaveBeenCalledWith({
        data: dto,
      });
    });
  });

  describe('findByCategory', () => {
    it('should throw error if invalid vendor category', async () => {
      (vendorCategoryService.findOne as jest.Mock<any>).mockResolvedValue(
        null,
      );
      await expect(service.findByCategory(99)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should return categories', async () => {
      (vendorCategoryService.findOne as jest.Mock<any>).mockResolvedValue({
        vendor_category_id: 1,
      });
      const expected = [{ category_name: 'Test' }];
      (
        prisma.mst_checklist_category.findMany as jest.Mock<any>
      ).mockResolvedValue(expected);

      const result = await service.findByCategory(1);
      expect(result).toEqual(expected);
    });
  });

  describe('reorderCategories', () => {
    it('should execute transaction', async () => {
      const dto = { items: [{ id: 1, display_order: 2 }] };
      (prisma.$transaction as jest.Mock<any>).mockResolvedValue(undefined);

      await service.reorderCategories(dto);
      expect(prisma.$transaction).toHaveBeenCalled();
    });
  });
});
