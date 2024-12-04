import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { IntercomService } from './intercom.service';
import { CreateIntercomDto } from './dto/create-intercom.dto';
import { UpdateIntercomDto } from './dto/update-intercom.dto';
import { FindIntercomDto } from './dto/find-intercom.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { LanguageDto, UserRole } from '../../shared/types/enums';
import { Language } from '../../shared/decorators/language.decorator';
import { SetRoles } from '../auth/set-roles.decorator';
import { IsLoggedIn } from '../../shared/guards/is-loggedin.guard';
import { HasRole } from '../../shared/guards/has-roles.guard';
import { ResponseIntercomDto } from './dto/intercom.dto';
import { MessageService } from '../../i18n/message.service';
import axios from 'axios';
import * as https from 'https';
// import AxiosDigestAuth from '@mhoc/axios-digest-auth';
import DigestClient from 'digest-fetch';

import crypto from 'crypto';

@ApiTags('Intercom')
@Controller('intercom')
export class IntercomController {
  constructor(
    private readonly intercomService: IntercomService,
    private readonly messageService: MessageService,
  ) {}

  @Get('opendoor')
  async openDoor() {
    const data = `<RemoteControlDoor version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
      <doorNo min="1" max="1"></doorNo>
      <cmd>open</cmd>
    </RemoteControlDoor>`;

    // HTTPS Agent with SSL verification disabled
    const agent = new https.Agent({
      rejectUnauthorized: false,
    });

    // Digest Authentication initialization
    const digestAuth = new DigestClient('admin', '12345678a', {
      algorithm: 'MD5',
    });

    try {
      // Perform the request with Digest Authentication
      const response = await digestAuth.fetch({
        method: 'PUT',
        url: 'https://172.25.25.96/ISAPI/AccessControl/RemoteControl/door/1',
        headers: {
          'Content-Type': 'application/xml',
        },
        // auth: {}

        httpsAgent: agent, // Attach the HTTPS agent to the request
        data: data,
      });

      console.log('Response:', response.formData);
      return response.formData; // Return the response to the client
    } catch (error) {
      console.log(error);
      console.error('Error:', error.message || error.response?.data);
      throw error; // Throw the error for proper handling
    }
  }

  private calculateDigestAuth(
    username: string,
    password: string,
    uri: string,
    method: string,
    nonce: string,
    cnonce: string,
    nc: string,
  ): string {
    const ha1 = crypto
      .createHash('md5')
      .update(`${username}:DS-9076C1B6:${password}`)
      .digest('hex');
    const ha2 = crypto
      .createHash('md5')
      .update(`${method}:${uri}`)
      .digest('hex');
    const response = crypto
      .createHash('md5')
      .update(`${ha1}:${nonce}:${nc}:${cnonce}:auth:${ha2}`)
      .digest('hex');

    return `Digest username="${username}", realm="DS-9076C1B6", nonce="${nonce}", uri="${uri}", qop="auth", algorithm="MD5", response="${response}", nc="${nc}", cnonce="${cnonce}"`;
  }

  @UseGuards(IsLoggedIn, HasRole)
  @SetRoles(UserRole.SYSTEM_ADMIN)
  @Post()
  @ApiResponse({
    status: 201,
    description: 'Intercom successfully created',
    type: ResponseIntercomDto,
  })
  @HttpCode(201)
  async create(
    @Body() createIntercomDto: CreateIntercomDto,
    @Language() language: LanguageDto,
  ) {
    try {
      const data = await this.intercomService.create(
        createIntercomDto,
        language,
      );
      return {
        success: true,
        code: 201,
        data,
        message: this.messageService.getMessage(
          'intercom',
          language,
          'intercom_created_successfully',
        ),
      };
    } catch (error) {
      throw error;
    }
  }

  @ApiResponse({
    status: 200,
    description: 'List of Intercoms',
    type: ResponseIntercomDto,
  })
  @HttpCode(200)
  @Get()
  async findAll(
    @Query() findIntercomDto: FindIntercomDto,
    @Language() language: LanguageDto,
  ) {
    try {
      const data = await this.intercomService.findAll(
        findIntercomDto,
        language,
      );
      return {
        success: true,
        code: 200,
        data,
        message: this.messageService.getMessage(
          'intercom',
          language,
          'intercom_fetched_successfully',
        ),
      };
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @SetRoles(UserRole.SYSTEM_ADMIN, UserRole.USER)
  @ApiResponse({
    status: 200,
    description: 'Single Intercom details',
    type: ResponseIntercomDto,
  })
  @HttpCode(200)
  async findOne(@Param('id') id: string, @Language() language: LanguageDto) {
    try {
      const data = await this.intercomService.findOne(id, language);
      return {
        success: true,
        code: 200,
        data,
        message: this.messageService.getMessage(
          'intercom',
          language,
          'intercom_fetched_successfully',
        ),
      };
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(IsLoggedIn, HasRole)
  @SetRoles(UserRole.SYSTEM_ADMIN)
  @Put(':id')
  @ApiResponse({
    status: 200,
    description: 'Intercom successfully updated',
  })
  @HttpCode(200)
  async update(
    @Param('id') id: string,
    @Body() updateIntercomDto: UpdateIntercomDto,
    @Language() language: LanguageDto,
  ) {
    try {
      await this.intercomService.update(id, updateIntercomDto, language);
      return {
        success: true,
        code: 200,
        message: this.messageService.getMessage(
          'intercom',
          language,
          'intercom_updated_successfully',
        ),
      };
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(IsLoggedIn, HasRole)
  @SetRoles(UserRole.SYSTEM_ADMIN)
  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Intercom successfully deleted',
  })
  @HttpCode(200)
  async remove(@Param('id') id: string, @Language() language: LanguageDto) {
    try {
      await this.intercomService.remove(id, language);
      return {
        success: true,
        code: 200,
        message: this.messageService.getMessage(
          'intercom',
          language,
          'intercom_deleted_successfully',
        ),
      };
    } catch (error) {
      throw error;
    }
  }
}
