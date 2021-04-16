'use strict';

module.exports = parseParams;
parseParams.parseOne = parseOne
parseParams.parseComment = parseComment
parseParams.parseDef = parseDef

function parseParams(script){
    const lines = script.split('\n').map(l=>l.trim()).filter(l=>l)
    let i = 0, line
    while(i<lines.length){
        line = lines[i]
        if(line.startsWith('function') && line.replace(/ /g,'') === 'functionmain({'){
            console.log(line)
            i++
            break;
        }
        i++
    }
    
    let groupIndex = 1
    const defs = []

    while(i<lines.length){
        line = lines[i]
        if(line[0] === '}') break

        if(line[0] === '/'){
            if(lines[i+1] && lines[i+1].indexOf('/') !== -1){
                // group
                const def = parseComment(line)
                let name = '_group_' +(groupIndex++)
                let caption = def.caption

                const idx = caption.lastIndexOf(':')
                if(idx !== -1){
                    name = caption.substring(idx+1).trim()
                    caption = caption.substring(0,idx).trim()
                }
                defs.push({name, type: 'group', caption})
                
            }else if(lines[i+1]){
                defs.push(parseOne(line,lines[i+1]))
                i++
            }
        }else{
            const idx = line.indexOf('/')
            if(idx === -1){
                const def = parseDef(line)
                def.caption = def.name
                defs.push(def)
            }else{
                defs.push(parseOne(
                    line.substring(idx).trim(),
                    line.substring(0,idx).trim()
                ))
            }
        }
        i++
    }

    return defs
}

function parseOne(comment, line){
    const {caption, options} = parseComment(comment)
    let def = {caption, ...parseDef(line)}
    if(options){
        def = {...def, ...options}
        if(def.type === 'checkbox' && def.hasOwnProperty('initial')) def.checked = true
    }

    return def;
}

function parseComment(comment){
    const prefix = comment.substring(0,2)
    if(prefix === '//') comment = comment.substring(2)
    if(prefix === '/*') comment = comment.substring(2, comment.length-2)
    
    comment = comment.trim()

    const ret = {}
    const idx = comment.indexOf('{')
    if(idx !== -1){
        ret.options = eval('('+comment.substring(idx)+')')
        comment = comment.substring(0,idx).trim()
    }
    
    ret.caption = comment


    return ret
}

function parseDef(line){
    if(line[line.length-1] == ',') line = line.substring(0,line.length-1)
    let idx = line.indexOf('=')

    if(idx == -1) idx = line.indexOf(':')

    if(idx == -1){
        return {name:line, type:'text'}
    }else{
        let initial = line.substring(idx+1).trim()
        
        const ret = {type:'text', name:line.substring(0,idx)}

        if(initial === 'true' || initial === 'false'){
            ret.type = 'checkbox'
            ret.checked = initial === 'true'

        }else if(/^[0-9]+$/.test(initial)){
            ret.type = 'int'
            ret.initial = parseFloat(initial)

        }else if(/^[0-9]+\.[0-9]+$/.test(initial)){
            ret.type = 'number'
            ret.initial = parseFloat(initial)
        }else{
            try {
                ret.initial = eval(initial)
            } catch (e) {
                console.log('problem evaluating inital value:', initial)
                throw e
            }
        }

        return ret
    }
}

