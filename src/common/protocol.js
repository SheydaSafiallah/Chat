class Protocol {
    #optionToString(command) {
        return Object.entries(command).map(
            entry => entry.join(':')
        )
    }

    #stringToOption(command) {
        return Object.fromEntries(
            command.map(
                entry => entry.split(":")
            )
        )
    }

    stringToCommand(string) {
        const [commandName, ...options] = string.split(' -Option ');
        return {
            commandName, ...this.#stringToOption(options)
        }
    }

    commandToString({commandName, ...options}) {
        return [commandName, ...this.#optionToString(options)].join(' -Option ');
    }
}

export default Protocol