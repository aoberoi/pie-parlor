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
            action_id: 'start_an_order',
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

app.action('start_an_order', async ({ action, ack, body, context }) => {
  console.log('\n\n** Start an order **');
  console.log(action);
  ack();
  await app.client.views.open({
    trigger_id: body.trigger_id,
    token: context.botToken,
    view: {
      type: 'modal',
      callback_id: 'order_submission',
      title: {
        type: 'plain_text',
        text: 'Order a Pie',
      },
      submit: {
        type: 'plain_text',
        text: 'Order',
      },
      close: {
        type: 'plain_text',
        text: 'Cancel',
      },
      blocks: [
        {
          type: 'input',
          block_id: 'filling',
          element: {
            type: 'static_select',
            action_id: 'select',
            placeholder: {
              type: 'plain_text',
              text: 'Choose a filling',
            },
            options: [
              {
                text: {
                  type: 'plain_text',
                  text: 'Pumpkin',
                },
                value: 'pumpkin',
              },
              {
                text: {
                  type: 'plain_text',
                  text: 'Apple',
                },
                value: 'apple',
              },
              {
                text: {
                  type: 'plain_text',
                  text: 'Pecan',
                },
                value: 'pecan',
              }
            ]
          },
          label: {
            type: 'plain_text',
            text: 'Filling',
          },
        },
        {
          type: 'input',
          block_id: 'toppings',
          element: {
            type: 'multi_static_select',
            action_id: 'selections',
            placeholder: {
              type: 'plain_text',
              text: 'Choose toppings',
            },
            options: [
              {
                text: {
                  type: 'plain_text',
                  text: 'Whipped cream',
                },
                value: 'whippedCream',
              },
              {
                text: {
                  type: 'plain_text',
                  text: 'Ice cream',
                },
                value: 'iceCream',
              },
              {
                text: {
                  type: 'plain_text',
                  text: 'Banana',
                },
                value: 'banana',
              },
              {
                text: {
                  type: 'plain_text',
                  text: 'Caramel sauce',
                },
                value: 'caramelSauce',
              },
              {
                text: {
                  type: 'plain_text',
                  text: 'Chocolate sauce',
                },
                value: 'chocolateSauce',
              },
            ],
          },
          label: {
            type: 'plain_text',
            text: 'Toppings',
          },
          optional: true,
        },
        {
          type: 'input',
          block_id: 'delivery',
          element: {
            type: 'datepicker',
            action_id: 'date',
          },
          label: {
            type: 'plain_text',
            text: 'Delivery date',
          },
          hint: {
            type: 'plain_text',
            text: 'Your pie will be delivered to your desk by 10AM on this day.',
          },
        },
      ],
    },
  });
});

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Bolt app is running!');
})();
