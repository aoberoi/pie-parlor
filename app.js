const { App } = require('@slack/bolt');

const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN,
});

app.event('message', ({ event, say }) => {
  if (event.text.includes('hungry')) {
    say({
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `<@${event.user}>, we've got fresh homemade pies.`,
          },
          accessory: {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Start an order',
            },
          },
        },
      ],
    });
  }
});

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Bolt app is running!');
})();
