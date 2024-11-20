import { Injectable } from '@nestjs/common';
import { userMessages } from './messages/user.message';
import { buildingMessages } from './messages/building.message';
import { authMessages } from './messages/auth.message';
import { districtMessages } from './messages/district.message';
import { regionMessages } from './messages/region.message';
// import { officeMessages } from './messages/office.message';
import { operatorUserMessages } from './messages/operatorUser.message';
// import { categoryMessages } from './messages/category.message';
// import { postMessages } from './messages/post.message';
// import { itemMessages } from './messages/item.message';
// import { orderMessages } from './messages/order.message';
@Injectable()
export class MessageService {
  private messages = {
    user: userMessages,
    auth: authMessages,
    building: buildingMessages,
    district: districtMessages,
    region: regionMessages,
    operatorUser: operatorUserMessages,
    // category: categoryMessages,
    // office: officeMessages,
    // post: postMessages,
    // item: itemMessages,
    // order: orderMessages,
  };
  getMessage(module: string, language: string, key: string): string {
    return (
      this.messages[module]?.[language]?.[key] ||
      this.messages[module]?.['en']?.[key] ||
      'Message not found'
    );
  }
}
