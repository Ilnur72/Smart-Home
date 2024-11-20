import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { User } from '../../modules/user/entities/user.entity';
import { UserRole } from '../../shared/types/enums';
import { hash } from 'bcryptjs';
import { Region } from '../../modules/region/entities/region.entity';
import { District } from '../../modules/district/entities/district.entity';
import { RegionService } from '../../modules/region/region.service';

interface RegionsInterface {
  id: string;
  name: string;
}

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Region)
    private readonly regionRepository: Repository<Region>,
    @InjectRepository(District)
    private readonly districtRepository: Repository<District>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly regionService: RegionService,
  ) {}

  async seed() {
    await this.seedRegions();
    // await this.seedAdmin();
  }

  private async seedAdmin() {
    const { data: region } = await this.regionService.findAll({ search: '' });
    const district = await this.districtRepository
      .createQueryBuilder('district')
      .where('district.name ILIKE :search', {
        search: `%Nukus shahar%`,
      })
      .getMany();
    const hashedPassword: string = await hash(process.env.ADMIN_PASSWORD, 10);

    const admin = {
      role: UserRole.ADMIN,
      surname: 'admin',
      name: 'admin',
      phone: process.env.ADMIN_PHONE,
      password: hashedPassword,
      regionId: region[0]?.id,
      districtId: district[0]?.id,
    };
    const newUser = this.userRepository.create(admin);
    return await this.userRepository.save(newUser);
  }

  private async seedRegions() {
    const regions: { data: RegionsInterface[] } = await axios.get(
      'https://robocontest.uz/api/regions',
    );
    await this.regionRepository.query('TRUNCATE TABLE "region" CASCADE');
    await this.regionRepository.query('TRUNCATE TABLE "district" CASCADE');

    for (const region of regions.data) {
      const regionId = region.id;
      delete region.id;
      const newRegion = await this.regionRepository.save({
        ...region,
        region_id: regionId,
      });
      const districts: { data: RegionsInterface[] } = await axios.get(
        `https://robocontest.uz/api/regions?q=${regionId}`,
      );

      for (const district of districts.data) {
        const districtId = district.id;
        delete district.id;
        await this.districtRepository.save({
          ...district,
          region_id: newRegion.id,
          district_id: districtId,
        });
      }
    }
  }
}
