# RPG Tools

Simple RPG tools for brazilian "Tormenta RPG" system

Mobile:
![Mobile view of a list of spells](./public/screenshots/spells-narrow.png 'Mobile')

Desktop:
![Desktop view of a list of spells](./public/screenshots/spells-wide.png 'Desktop')

Next steps:

- Shared characters on the lobby room:
  - The DM becomes kind of a server, being the host of p2p connection, it will be one connection per player.
  - Player chooses one of its character and send it the host, a deep watcher is added with a debouncer, every change is sent to the host.
  - Host replaces the previous sheet and sends it to the others players on every change.
  - One sheet per message, a level 20 character sheet should be about 10kb, below the 16kb which is kind of safe for webrtc.
  - An overall page showing the life and mana of each character on the lobby, if you click in one of them you go to a readonly version of CharacterSingleView, something like /outros-personagens/{some-identifier}
- List of basic feats with their descriptions that you can add to your character sheet.
- List of basic races and class that will apply automatically based on level and stuff (no idea on how to do multiclass when that is done).
