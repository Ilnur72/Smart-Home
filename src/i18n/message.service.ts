import { Injectable } from '@nestjs/common';
import { userMessages } from './messages/user.message';
import { buildingMessages } from './messages/building.message';
import { authMessages } from './messages/auth.message';
import { districtMessages } from './messages/district.message';
import { regionMessages } from './messages/region.message';
import { operatorUserMessages } from './messages/operatorUser.message';
import { operatorMessages } from './messages/operator.message';
import { apartmentMessages } from './messages/apartment.message';
import { intercomMessages } from './messages/intercom.message';
import { cameraMessages } from './messages/camera.message';
import { entranceMessages } from './messages/entrance.message';
@Injectable()
export class MessageService {
  private messages = {
    user: userMessages,
    auth: authMessages,
    building: buildingMessages,
    district: districtMessages,
    region: regionMessages,
    operatorUser: operatorUserMessages,
    operator: operatorMessages,
    apartment: apartmentMessages,
    intercom: intercomMessages,
    camera: cameraMessages,
    entrance: entranceMessages,
  };
  getMessage(module: string, language: string, key: string): string {
    return (
      this.messages[module]?.[language]?.[key] ||
      this.messages[module]?.['en']?.[key] ||
      'Message not found'
    );
  }
}
