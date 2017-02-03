'use strict'

exports.handle = function handle(client) {

  const sayHello = client.createStep({
    satisfied() {
      return Boolean(client.getConversationState().helloSent)
    },

    prompt() {
      client.addResponse('welcome')
      client.addResponse('provide/documentation', {
        documentation_link: 'http://docs.init.ai',
      })
      client.addResponse('provide/instructions')
      client.updateConversationState({
        helloSent: true
      })
      client.done()
    }
  })

  const handleThanks = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      client.addResponse('thanks')
      client.done()
    }
  })

  const handleHuman = client.createStep({
    satisfied() {
      return false
    },
    prompt() {
      client.addResponse('turing/request_human')
      client.done()
    }
  })

  const handleGreeting = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      client.addResponse('greeting')
      client.done()
    }
  })

  const handleGoodbye = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      client.addResponse('goodbye')
      client.done()
    }
  })

  client.runFlow({
    classifications: {
      goodbye: 'goodbye',
      greeting: 'greeting',
      request_human: 'turing/request_human',
      thanks: 'thanks',

    },
    streams: {
      goodbye: handleGoodbye,
      greeting: handleGreeting,
      request_human: handleHuman,
      thanks:handleThanks,
      main: 'onboarding',
      onboarding: [sayHello],
      end: [handleThanks]
    }
  })
}