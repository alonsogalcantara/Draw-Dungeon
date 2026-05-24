import type { MissionCard } from '../../game/types';
import { getImageUrl } from './utils';

export const MISSION_CARDS: MissionCard[] = [
  {
    id: 'mission_empty_chalice',
    name: 'El Cáliz Vacío',
    type: 'mission',
    campaign: 'tower',
    image: getImageUrl('tower', 'mission', 'El Cáliz Vacío'),
    description: 'Un cáliz antiguo que resuena con magia latente, esperando ser llenado.',
    deliveryTargets: [
      {
        roomType: 'shrine',
        reward: { label: 'Llenado con agua bendita', effects: [{ stat: 'hp', value: 10 }] },
        rewardDescription: 'Llenar en un Santuario: Cura mucha Vida (HP).'
      },
      {
        roomType: 'bonfire',
        reward: { label: 'Cáliz fundido', effects: [{ stat: 'gold', value: 10 }] },
        rewardDescription: 'Fundir en la Hoguera: Obtienes 10 de Oro.'
      }
    ]
  },
  {
    id: 'mission_corrupted_relic',
    name: 'La Reliquia Corrupta',
    type: 'mission',
    campaign: 'tower',
    image: getImageUrl('tower', 'mission', 'La Reliquia Corrupta'),
    description: 'Un artefacto oscuro que susurra en tu mente. Pierdes algo de Comida lentamente por su influencia.',
    passiveEffect: {
      type: 'loseFoodOnDelve',
      amount: 1,
      description: 'Pierdes 1 de Comida adicional al descender de piso.'
    },
    deliveryTargets: [
      {
        roomType: 'tomb',
        reward: { label: 'Reliquia enterrada', effects: [{ stat: 'xp', value: 5 }] },
        rewardDescription: 'Enterrar en la Tumba: Obtienes +5 XP.'
      },
      {
        roomType: 'shrine',
        reward: { label: 'Reliquia purificada', effects: [{ stat: 'armor', value: 2 }] },
        rewardDescription: 'Purificar en el Santuario: Obtienes +2 Armadura.'
      }
    ]
  },
  {
    id: 'mission_ancient_map',
    name: 'El Mapa Antiguo',
    type: 'mission',
    campaign: 'tower',
    image: getImageUrl('tower', 'mission', 'El Mapa Antiguo'),
    description: 'Un pergamino desgastado que muestra las líneas de energía mágica de la mazmorra.',
    deliveryTargets: [
      {
        roomType: 'merchant',
        reward: { label: 'Vendido a un buen precio', effects: [{ stat: 'gold', value: 8 }, { stat: 'food', value: 2 }] },
        rewardDescription: 'Vender al Comerciante: Obtienes +8 Oro y +2 Comida.'
      },
      {
        roomType: 'shrine',
        reward: { label: 'Líneas místicas decodificadas', effects: [{ stat: 'xp', value: 3 }, { stat: 'hp', value: 3 }] },
        rewardDescription: 'Decodificar en el Santuario: Obtienes +3 XP y +3 HP (Además revelará cartas de tu piso actual).'
      }
    ]
  }
];
