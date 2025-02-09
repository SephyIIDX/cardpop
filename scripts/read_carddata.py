from operator import itemgetter

# Read card data from rom
card_data_start_offset = 0x5c430
card_data_end_offset = 0x62a6a
with open('baserom.gbc','rb') as file:
    file.seek(card_data_start_offset)
    card_data_bytes = file.read(card_data_end_offset - card_data_start_offset)

# Card data offsets
CARD_DATA_TYPE = 0x00
CARD_DATA_RARITY = 0x05
CARD_DATA_SET = 0x07
CARD_DATA_ID_LOW = 0x08
CARD_DATA_ID_HIGH = 0x09

PKMN_CARD_DATA_LENGTH = 0x42
NON_PKMN_CARD_DATA_LENGTH = 0x10 # Energy or Trainer

card_data = []

remaining_bytes = card_data_bytes
while len(remaining_bytes) > 0:
    card_type = remaining_bytes[CARD_DATA_TYPE]

    if card_type <= 6:
        # It's a pokemon
        card_bytes = remaining_bytes[:PKMN_CARD_DATA_LENGTH]
    else:
        # It's an energy or trainer
        card_bytes = remaining_bytes[:NON_PKMN_CARD_DATA_LENGTH]
    print(card_bytes.hex())

    card_id = (card_bytes[CARD_DATA_ID_HIGH] << 8) | card_bytes[CARD_DATA_ID_LOW]
    card_data.append({'id': card_id, 'rarity': card_bytes[CARD_DATA_RARITY], 'set': card_bytes[CARD_DATA_SET]})

    remaining_bytes = remaining_bytes[len(card_bytes):]

card_data.sort(key=itemgetter('id'))

# Print card data as javascript list
print('const cardData = [')
for card in card_data:
    print(f'\t{{"id": {hex(card['id'])}, "rarity": {hex(card['rarity'])}, "set": {hex(card['set'])}}},')
print('];')
