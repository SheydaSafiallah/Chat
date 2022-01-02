class Protocol {
    static #optionToString(command) {
        return Object.entries(command).map(
            entry => entry.join(':')
        )
    }

    static #stringToOption(command) {
        return Object.fromEntries(
            command.map(
                entry => entry.split(":")
            )
        )
    }

    static stringToCommand(string) {
        const [commandName, ...options] = string.split(' -Option ');
        return {
            commandName, ...this.#stringToOption(options)
        }
    }

    static commandToString({commandName, ...options}) {
        return [commandName, ...this.#optionToString(options)].join(' -Option ');
    }
}

export default Protocol